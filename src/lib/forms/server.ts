/**
 * Server-side form handling: validation, spam protection, rate limiting and
 * delivery. A submission is either delivered or the visitor gets an explicit
 * error - never a silent drop (spam caught by the honeypot excepted).
 */
import type { APIContext } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { forms, HONEYPOT, TIMESTAMP, type FormDef, type Field } from './definitions';

const env = (k: string) => process.env[k]?.trim() || '';
const FALLBACK_EMAIL = 'business@voisetech.com';

type Upload = { field: string; filename: string; content: Buffer; contentType: string };
type Result = { status: number; ok: boolean; message: string; errors?: Record<string, string>; redirect?: string };

/* ------------------------------------------------------------ rate limit */
const hits = new Map<string, number[]>();
function rateLimited(key: string) {
  const limit = Number(env('FORM_RATE_LIMIT')) || 5;
  const windowMs = 10 * 60 * 1000;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t > windowMs)) hits.delete(k);
  return recent.length > limit;
}

/* ------------------------------------------------------------ validation */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{6,40}$/;
const MAGIC: Record<string, (b: Buffer) => boolean> = {
  '.pdf': (b) => b.subarray(0, 4).toString('latin1') === '%PDF',
  '.docx': (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
  '.doc': (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0,
};
const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function normaliseUrl(v: string) {
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  const u = new URL(withScheme);
  if (!u.hostname.includes('.')) throw new Error('bad host');
  return u.href;
}

async function validate(def: FormDef, data: FormData) {
  const values: Record<string, string> = {};
  const uploads: Upload[] = [];
  const errors: Record<string, string> = {};

  for (const f of def.fields) {
    if (f.type === 'file') {
      const file = data.get(f.name);
      const present = file instanceof File && file.size > 0;
      if (!present) { if (f.required) errors[f.name] = `Please attach your ${f.label.toLowerCase()}.`; continue; }
      const ext = (file.name.match(/\.[^.]+$/)?.[0] ?? '').toLowerCase();
      if (!f.accept?.includes(ext)) { errors[f.name] = 'Please upload a PDF, DOC or DOCX file.'; continue; }
      if (f.maxBytes && file.size > f.maxBytes) { errors[f.name] = 'This file is larger than 5 MB.'; continue; }
      const buf = Buffer.from(await file.arrayBuffer());
      if (!MAGIC[ext]?.(buf)) { errors[f.name] = 'This file doesn’t look like a valid PDF or Word document.'; continue; }
      const safeName = file.name.replace(/[^\w.\- ]+/g, '_').slice(-120);
      uploads.push({ field: f.label, filename: safeName, content: buf, contentType: MIME[ext] });
      continue;
    }
    const raw = String(data.get(f.name) ?? '').replace(/\r\n/g, '\n').trim();
    if (!raw) { if (f.required) errors[f.name] = requiredMessage(f); continue; }
    if (f.maxLength && raw.length > f.maxLength) { errors[f.name] = `Please keep this under ${f.maxLength} characters.`; continue; }
    if (f.type === 'email' && !EMAIL.test(raw)) { errors[f.name] = 'Please enter a valid email address, like name@company.com.'; continue; }
    if (f.type === 'tel' && !PHONE.test(raw)) { errors[f.name] = 'Please enter a valid phone number (digits, spaces, +, - and brackets).'; continue; }
    if (f.type === 'select') {
      // Tolerate dash / whitespace / case variants (e.g. "4-7 years" for "4–7 years").
      const match = f.options?.find((o) => normaliseOption(o) === normaliseOption(raw));
      if (match) values[f.name] = match;
      else errors[f.name] = requiredMessage(f);
      continue;
    }
    if (f.type === 'url') {
      try { values[f.name] = normaliseUrl(raw); } catch { errors[f.name] = 'Please enter a valid website address, like example.com.'; }
      continue;
    }
    values[f.name] = raw;
  }
  return { values, uploads, errors };
}

const normaliseOption = (s: string) => s.normalize('NFKC').replace(/[‐-―−-]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();

const requiredMessage = (f: Field) => (f.type === 'select' ? `Please choose an option for “${f.label}”.` : `Please enter your ${f.label.toLowerCase()}.`);

/* ------------------------------------------------------------- reCAPTCHA */
async function verifyRecaptcha(token: string, action: string, ip: string) {
  const secret = env('RECAPTCHA_SECRET_KEY');
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const r = (await res.json()) as { success: boolean; score?: number; action?: string };
    return r.success && (r.score ?? 1) >= (Number(env('RECAPTCHA_MIN_SCORE')) || 0.5) && (!r.action || r.action === action);
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------- delivery */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function renderMessage(def: FormDef, values: Record<string, string>, uploads: Upload[], meta: Record<string, string>) {
  const rows = def.fields.filter((f) => f.type !== 'file').map((f) => [f.label, values[f.name] ?? '-']);
  if (uploads.length) rows.push(['Attachments', uploads.map((u) => `${u.field}: ${u.filename}`).join('\n')]);
  const text = [`New ${def.title} from www.voisetech.com`, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', ...Object.entries(meta).map(([k, v]) => `${k}: ${v}`)].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#17191d">
<p style="margin:0 0 16px"><strong>New ${esc(def.title)}</strong> from www.voisetech.com</p>
<table cellpadding="8" style="border-collapse:collapse;border:1px solid #e3e6eb">${rows
    .map(([k, v]) => `<tr><td style="border:1px solid #e3e6eb;background:#f5f6f8;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="border:1px solid #e3e6eb;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table>
<p style="color:#5f6672;font-size:12px;margin-top:16px">${Object.entries(meta).map(([k, v]) => `${esc(k)}: ${esc(v)}`).join('<br>')}</p></div>`;
  return { text, html };
}

function deliveryMode() {
  const mode = env('FORM_DELIVERY').toLowerCase();
  if (mode === 'smtp' || mode === 'file') return mode;
  if (env('SMTP_HOST')) return 'smtp';
  if (import.meta.env.DEV) return 'file';
  return 'none';
}

let transport: nodemailer.Transporter | undefined;
async function deliver(def: FormDef, values: Record<string, string>, uploads: Upload[], meta: Record<string, string>) {
  const mode = deliveryMode();
  const { text, html } = renderMessage(def, values, uploads, meta);
  const subject = def.subject(values);

  if (mode === 'smtp') {
    transport ??= nodemailer.createTransport({
      host: env('SMTP_HOST'),
      port: Number(env('SMTP_PORT')) || 587,
      secure: env('SMTP_SECURE') === 'true',
      auth: env('SMTP_USER') ? { user: env('SMTP_USER'), pass: env('SMTP_PASS') } : undefined,
    });
    await transport.sendMail({
      from: env('MAIL_FROM') || `VoiseTech Website <${FALLBACK_EMAIL}>`,
      to: env(def.recipientsEnv) || FALLBACK_EMAIL,
      replyTo: values.email,
      subject,
      text,
      html,
      attachments: uploads.map((u) => ({ filename: u.filename, content: u.content, contentType: u.contentType })),
    });
    return;
  }

  if (mode === 'file') {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = join(process.cwd(), '.submissions', `${stamp}-${def.id}`);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'submission.json'), JSON.stringify({ form: def.id, subject, to: env(def.recipientsEnv) || FALLBACK_EMAIL, values, meta, attachments: uploads.map((u) => u.filename) }, null, 2));
    await writeFile(join(dir, 'message.txt'), text);
    for (const u of uploads) await writeFile(join(dir, u.filename), u.content);
    console.info(`[forms] ${def.id} submission written to ${dir}`);
    return;
  }

  throw Object.assign(new Error('No form delivery configured (set SMTP_HOST or FORM_DELIVERY).'), { code: 'NO_TRANSPORT' });
}

/* -------------------------------------------------------------- handler */
/** X-Forwarded-For is only trusted behind a reverse proxy (TRUST_PROXY=true); otherwise it could be spoofed. */
function clientIp(ctx: APIContext) {
  const fwd = env('TRUST_PROXY') === 'true' ? ctx.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : '';
  if (fwd) return fwd;
  try { return ctx.clientAddress; } catch { return 'unknown'; }
}

async function processSubmission(id: FormDef['id'], ctx: APIContext): Promise<Result> {
  const def = forms[id];
  const ip = clientIp(ctx);
  if (rateLimited(`${id}:${ip}`)) {
    return { status: 429, ok: false, message: `You’ve sent several requests in a short time. Please wait a few minutes, or email us at ${FALLBACK_EMAIL}.` };
  }

  let data: FormData;
  try {
    data = await ctx.request.formData();
  } catch {
    return { status: 400, ok: false, message: 'We couldn’t read that submission. If you attached files, please make sure each is under 5 MB.' };
  }

  // Bots fill the hidden field or submit implausibly fast; answer as if accepted.
  const t = Number(data.get(TIMESTAMP));
  if (String(data.get(HONEYPOT) ?? '') !== '' || (t > 0 && Date.now() - t < 2500)) {
    return { status: 200, ok: true, message: 'Thank you.', redirect: '/thank-you/' };
  }

  if (!(await verifyRecaptcha(String(data.get('g-recaptcha-response') ?? ''), id, ip))) {
    return { status: 400, ok: false, message: `We couldn’t verify this submission. Please try again, or email us at ${FALLBACK_EMAIL}.` };
  }

  const { values, uploads, errors } = await validate(def, data);
  if (Object.keys(errors).length) return { status: 422, ok: false, message: 'Please check the highlighted fields.', errors };

  try {
    await deliver(def, values, uploads, {
      Submitted: new Date().toISOString(),
      Page: ctx.request.headers.get('referer') ?? '-',
      'User agent': ctx.request.headers.get('user-agent')?.slice(0, 200) ?? '-',
    });
  } catch (err) {
    console.error(`[forms] ${id} delivery failed:`, err);
    const noTransport = (err as { code?: string }).code === 'NO_TRANSPORT';
    return {
      status: noTransport ? 503 : 502,
      ok: false,
      message: `Sorry - we couldn’t send your ${id === 'careers' ? 'application' : 'message'} just now. Please try again shortly or email us directly at ${FALLBACK_EMAIL}.`,
    };
  }
  return { status: 200, ok: true, message: 'Thank you - we’ll be in touch shortly.', redirect: '/thank-you/' };
}

/** Responds with JSON for fetch() callers and with a redirect / plain page for no-JS form posts. */
export async function handleForm(id: FormDef['id'], ctx: APIContext) {
  const result = await processSubmission(id, ctx);
  const wantsJson = (ctx.request.headers.get('accept') ?? '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: result.ok, message: result.message, errors: result.errors, redirect: result.redirect }), {
      status: result.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  if (result.ok) return ctx.redirect(result.redirect ?? '/thank-you/', 303);
  const items = Object.values(result.errors ?? {}).map((e) => `<li>${esc(e)}</li>`).join('');
  return new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Please check your submission - Voise Tech</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:10vh auto;padding:0 20px;color:#17191d;line-height:1.6}a{color:#0663b0}</style></head>
<body><h1>We couldn’t send your form yet</h1><p>${esc(result.message)}</p>${items ? `<ul>${items}</ul>` : ''}<p><a href="javascript:history.back()">Go back and try again</a> or email <a href="mailto:${FALLBACK_EMAIL}">${FALLBACK_EMAIL}</a>.</p></body></html>`,
    { status: result.status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}
