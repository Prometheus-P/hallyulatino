export type LatamCategory = 'music' | 'series' | 'event' | 'gastronomy' | 'culture';

export interface FeatureBlock {
  heading?: string;
  body: string;
}

export interface FeatureSeoMeta {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export interface FeatureFormValues {
  title: string;
  descriptionEs: string;
  category: LatamCategory;
  countries: string[];
  latamHook: string[];
  heroImage?: string;
  heroImageAlt?: string;
  publishDate: string;
  author: string;
  tags: string[];
  blocks: FeatureBlock[];
  seoMeta?: FeatureSeoMeta;
}

export interface FeatureContent extends FeatureFormValues {
  slug: string;
  draft?: boolean;
}
