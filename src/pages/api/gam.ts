import type { APIRoute } from 'astro';
import { handleForm } from '../../lib/forms/server';

export const prerender = false;

export const POST: APIRoute = (ctx) => handleForm('gam', ctx);
export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
