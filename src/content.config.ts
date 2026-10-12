import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const image = z.object({ src: z.string(), width: z.number(), height: z.number() });
const link = z.object({ label: z.string(), href: z.string() });

/** Fields shared by everything imported from WordPress (scripts/import-wordpress.mjs). */
const base = {
  title: z.string(),
  seoTitle: z.string().optional(),
  description: z.string().default(''),
  excerpt: z.string().default(''),
  image: image.optional(),
  banner: image.optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  wpId: z.number().optional(),
  manual: z.boolean().optional(),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    ...base,
    tags: z.array(z.object({ name: z.string(), slug: z.string() })).default([]),
    cta: link.optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    ...base,
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    publishers: z.array(z.string()).default([]),
    cta: link.optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    ...base,
    dateText: z.string().optional(),
    location: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    startsAt: z.string().optional(),
    countdownHeading: z.string().optional(),
    rsvpNote: z.string().optional(),
    actions: z.array(link).default([]),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    effective: z.string().optional(),
    updated: z.string().optional(),
  }),
});

export const collections = { blog, caseStudies, events, legal };
