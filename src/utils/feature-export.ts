import type { FeatureContent } from '../types/feature';

const FRONTMATTER_FIELDS: Array<keyof FeatureContent> = [
  'title',
  'descriptionEs',
  'category',
  'countries',
  'latamHook',
  'heroImage',
  'heroImageAlt',
  'publishDate',
  'author',
  'tags',
  'blocks',
  'seoMeta',
  'draft',
];

const serialize = (value: unknown): string => {
  return JSON.stringify(value, null, 2).replace(/\"([^(\")"]+)\":/g, '$1:');
};

export const buildMdxFrontmatter = (feature: FeatureContent): string => {
  const lines: string[] = ['---'];
  FRONTMATTER_FIELDS.forEach((field) => {
    const val = feature[field];
    if (val === undefined || val === null || val === '') return;
    if (field === 'publishDate') {
      lines.push(`publishDate: ${feature.publishDate}`);
      return;
    }
    lines.push(`${field}: ${serialize(val)}`);
  });
  lines.push('---');
  return lines.join('\n');
};

export const buildMdxDocument = (feature: FeatureContent): string => {
  const fm = buildMdxFrontmatter(feature);
  const body =
    feature.blocks?.map((block) => {
      const heading = block.heading ? `\n## ${block.heading}\n` : '\n';
      return `${heading}${block.body || ''}`;
    }).join('\n') || '\n';
  return `${fm}\n${body}\n`;
};
