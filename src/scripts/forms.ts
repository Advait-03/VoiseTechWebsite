/**
 * Progressive enhancement for forms rendered by Form.astro: inline validation
 * with clear messages, an error summary, file checks, optional reCAPTCHA v3,
 * fetch submission with loading / error states, and the /thank-you/ redirect
 * the live site used (so conversion tracking keeps working).
 */
declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, o: { action: string }) => Promise<string> };
    dataLayer?: unknown[];
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{6,40}$/;
const CONTACT_EMAIL = 'business@voisetech.com';

function labelText(field: HTMLElement) {
  const text = field.querySelector('.label-text')?.textContent ?? 'This field';
  return text.replace(/\*$/, '').trim();
}

function messageFor(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, field: HTMLElement): string {
  const label = labelText(field);
  const value = control.value.trim();
  if (control instanceof HTMLInputElement && control.type === 'file') {
    const file = control.files?.[0];
    if (!file) return control.required ? `Please attach your ${label.toLowerCase()}.` : '';
    const ext = file.name.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? '';
    if (!control.accept.split(',').includes(ext)) return 'Please upload a PDF, DOC or DOCX file.';
    const max = Number(control.dataset.maxBytes);
    if (max && file.size > max) return `This file is ${(file.size / 1048576).toFixed(1)} MB — the limit is 5 MB.`;
    return '';
  }
  if (!value) {
    if (!control.required) return '';
    return control instanceof HTMLSelectElement ? `Please choose an option for “${label}”.` : `Please enter your ${label.toLowerCase()}.`;
  }
  if (control instanceof HTMLInputElement) {
    if (control.type === 'email' && !EMAIL.test(value)) return 'Please enter a valid email address, like name@company.com.';
    if (control.type === 'tel' && !PHONE.test(value)) return 'Please enter a valid phone number (digits, spaces, +, - and brackets).';
    if (control.type === 'url' && !/^(https?:\/\/)?[^\s/$.?#]+\.[^\s]+$/i.test(value)) return 'Please enter a valid website address, like example.com.';
  }
  if (control.maxLength > 0 && value.length > control.maxLength) return `Please keep this under ${control.maxLength} characters.`;
  return '';
}

function setError(field: HTMLElement, message: string) {
  const control = field.querySelector<HTMLInputElement>('input, select, textarea')!;
  const out = field.querySelector<HTMLElement>('[data-error]')!;
  out.textContent = message;
  if (message) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
}

function loadRecaptcha(key: string) {
  if (document.querySelector('script[data-recaptcha-loader]')) return;
  const s = document.createElement('script');
  s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
  s.async = true;
  s.dataset.recaptchaLoader = '';
  document.head.appendChild(s);
}

async function recaptchaToken(key: string, action: string) {
  loadRecaptcha(key);
  for (let i = 0; i < 50 && !window.grecaptcha; i++) await new Promise((r) => setTimeout(r, 100));
  if (!window.grecaptcha) return '';
  await new Promise<void>((r) => window.grecaptcha!.ready(r));
  return window.grecaptcha.execute(key, { action });
}

function initForm(form: HTMLFormElement) {
  if (form.dataset.ready) return;
  form.dataset.ready = '1';
  const id = form.dataset.form!;
  const fields = [...form.querySelectorAll<HTMLElement>('[data-field]')];
  const summary = form.querySelector<HTMLElement>('[data-form-summary]')!;
  const summaryList = summary.querySelector<HTMLElement>('[data-summary-list]')!;
  const summaryText = summary.querySelector<HTMLElement>('[data-summary-text]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const recaptchaKey = form.dataset.recaptcha;
  form.querySelector<HTMLInputElement>('[data-form-time]')!.value = String(Date.now());

  if (recaptchaKey) form.addEventListener('focusin', () => loadRecaptcha(recaptchaKey), { once: true });

  // Validate a field once the visitor leaves it, then live while they correct it.
  fields.forEach((field) => {
    const control = field.querySelector<HTMLInputElement>('input, select, textarea')!;
    let touched = false;
    control.addEventListener('blur', () => { touched = true; setError(field, messageFor(control, field)); });
    control.addEventListener('input', () => { if (touched || control.hasAttribute('aria-invalid')) setError(field, messageFor(control, field)); });

    const drop = field.querySelector<HTMLElement>('[data-drop]');
    if (drop) {
      const text = drop.querySelector<HTMLElement>('[data-drop-text]')!;
      const original = text.textContent;
      control.addEventListener('change', () => {
        const file = control.files?.[0];
        drop.classList.toggle('has-file', !!file);
        text.textContent = file ? `${file.name} · ${(file.size / 1048576).toFixed(2)} MB` : original;
        setError(field, messageFor(control, field));
      });
      ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.add('is-over')));
      ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
    }
  });

  function showSummary(errors: { field: HTMLElement; message: string }[], heading = 'Please check the highlighted fields.') {
    summaryText.textContent = heading;
    summaryList.replaceChildren(
      ...errors.map(({ field, message }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const control = field.querySelector('input, select, textarea')!;
        a.href = `#${control.id}`;
        a.textContent = message;
        a.addEventListener('click', (e) => { e.preventDefault(); (control as HTMLElement).focus(); });
        li.appendChild(a);
        return li;
      }),
    );
    summary.hidden = false;
    summary.focus();
  }

  const submitLabel = submit.querySelector<HTMLElement>('.submit-label')!;
  const idleLabel = submitLabel.textContent;
  function setBusy(busy: boolean) {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = busy ? 'Sending…' : idleLabel;
  }

  function showStatus(kind: 'error' | 'success', html: string) {
    status.className = `status is-${kind}`;
    status.innerHTML = html;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'status';

    const errors = fields
      .map((field) => {
        const control = field.querySelector<HTMLInputElement>('input, select, textarea')!;
        const message = messageFor(control, field);
        setError(field, message);
        return { field, message };
      })
      .filter((x) => x.message);
    if (errors.length) { showSummary(errors); return; }
    summary.hidden = true;

    setBusy(true);
    try {
      const data = new FormData(form);
      if (recaptchaKey) data.set('g-recaptcha-response', await recaptchaToken(recaptchaKey, id));
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Record<string, string>; redirect?: string };

      if (res.ok && body.ok) {
        window.dataLayer?.push({ event: 'form_submit', form_id: id });
        showStatus('success', 'Thank you — your submission has been received. Redirecting…');
        setTimeout(() => (location.href = body.redirect ?? '/thank-you/'), 400);
        return;
      }
      if (body.errors) {
        const serverErrors = Object.entries(body.errors)
          .map(([name, message]) => {
            const field = fields.find((f) => f.dataset.field === name);
            if (field) setError(field, message);
            return field ? { field, message } : null;
          })
          .filter(Boolean) as { field: HTMLElement; message: string }[];
        if (serverErrors.length) { showSummary(serverErrors); setBusy(false); return; }
      }
      showStatus('error', `${escapeHtml(body.message ?? 'Something went wrong while sending your form.')} <a href="mailto:${CONTACT_EMAIL}">Email ${CONTACT_EMAIL}</a>`);
    } catch {
      showStatus('error', `We couldn’t reach the server. Please check your connection and try again, or email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`);
    }
    setBusy(false);
  });
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(initForm);
}
