import { defineMiddleware } from 'astro:middleware';
import { redirectFor } from './data/redirects';

/**
 * Runs for on-demand requests (form API, and any URL without a prerendered
 * page), which is where legacy WordPress URLs land. Sends 301s for them and
 * adds baseline security headers to dynamic responses.
 */
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (!ctx.isPrerendered) {
    const target = redirectFor(ctx.url.pathname);
    if (target) return ctx.redirect(target + ctx.url.search, 301);
  }
  const res = await next();
  if (!ctx.isPrerendered) {
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }
  return res;
});
