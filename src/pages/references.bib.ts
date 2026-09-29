import type { APIRoute } from 'astro';
import { bibtex } from '../data/publications';

export const GET: APIRoute = () =>
  new Response(bibtex, {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
