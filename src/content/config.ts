import { defineCollection, z } from 'astro:content';

const kdramaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleKorean: z.string(),                    // Korean title
    description: z.string().max(160),           // Meta description
    image: z.string(),                          // Featured image
    imageAlt: z.string(),
    network: z.string(),                        // Broadcasting network (tvN, SBS, etc.)
    episodes: z.number(),                       // Total episodes
    status: z.enum(['emision', 'finalizado', 'proximo']),  // Airing status
    genre: z.array(z.string()),                 // Genres
    cast: z.array(z.object({                    // Cast members
      name: z.string(),
      nameKorean: z.string(),
      role: z.string(),
    })),
    rating: z.number().min(0).max(10).optional(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Hallyu Latino'),
  }),
});

const kpopCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    image: z.string(),
    imageAlt: z.string(),
    artistType: z.enum(['grupo', 'solista']),
    company: z.string(),                        // Agency/Label
    debutYear: z.number(),
    members: z.array(z.object({                 // Member info
      name: z.string(),
      nameKorean: z.string(),
      position: z.string(),
      birthYear: z.number().optional(),
    })).optional(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Hallyu Latino'),
  }),
});

const viajesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    image: z.string(),
    imageAlt: z.string(),
    category: z.enum(['transporte', 'alojamiento', 'comida', 'lugares', 'consejos']),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Hallyu Latino'),
  }),
});

export const collections = {
  kdrama: kdramaCollection,
  kpop: kpopCollection,
  viajes: viajesCollection,
};
