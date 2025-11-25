export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishDate?: Date;
  updatedDate?: Date;
  author?: string;
  noindex?: boolean;
}

export const SITE_CONFIG = {
  name: 'Hallyu Latino',
  description: 'Tu portal de K-dramas, K-pop y cultura coreana en español',
  url: 'https://hallyulatino.com',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@hallyulatino',
  locale: 'es_419',
  language: 'es',
};

export function generateTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_CONFIG.name;
  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

export function generateCanonical(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

export function generateMetaTags(props: SEOProps) {
  const title = generateTitle(props.title);
  const canonical = props.canonical || SITE_CONFIG.url;
  const image = props.image || SITE_CONFIG.defaultImage;
  const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  return {
    title,
    description: props.description,
    canonical,
    openGraph: {
      type: props.type || 'website',
      url: canonical,
      title,
      description: props.description,
      image: imageUrl,
      imageAlt: props.imageAlt || props.title,
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      title,
      description: props.description,
      image: imageUrl,
      imageAlt: props.imageAlt || props.title,
    },
    robots: props.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}

export interface ArticleSchema {
  title: string;
  description: string;
  image: string;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
  url: string;
}

export function generateArticleSchema(article: ArticleSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `${SITE_CONFIG.url}${article.image}`,
    datePublished: article.publishDate.toISOString(),
    dateModified: (article.updatedDate || article.publishDate).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/favicon.svg`,
    description: SITE_CONFIG.description,
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.twitterHandle.replace('@', '')}`,
    ],
  };
}

export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
