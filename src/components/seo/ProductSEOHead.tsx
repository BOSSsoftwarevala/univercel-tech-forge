/**
 * Product SEO Head Component
 * Injects dynamic meta tags, Open Graph, and JSON-LD structured data
 */

import { useEffect } from 'react';

interface ProductSEOHeadProps {
  productName: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  imageUrl?: string;
  price?: number;
  rating?: number;
  category?: string;
  slug?: string;
  type?: string;
}

export function ProductSEOHead({
  productName,
  metaTitle,
  metaDescription,
  keywords = [],
  imageUrl,
  price,
  rating,
  category,
  slug,
  type = 'SaaS',
}: ProductSEOHeadProps) {
  const title = metaTitle || `${productName} | SaaS Vala Marketplace`;
  const description = metaDescription || 
    `${productName} - ${category || 'Software'} solution. Try live demo and buy instantly on SaaS Vala Marketplace.`;
  const url = `https://softwarewalanet.lovable.app/marketplace/${slug || 'product'}`;
  const image = imageUrl || 'https://softwarewalanet.lovable.app/og-image.png';

  useEffect(() => {
    // Title
    document.title = title;

    // Standard meta
    setMeta('description', description);
    setMeta('keywords', keywords.join(', '));

    // Open Graph
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', image);
    setMetaProperty('og:url', url);
    setMetaProperty('og:type', 'product');
    setMetaProperty('og:site_name', 'SaaS Vala Marketplace');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: productName,
      description,
      applicationCategory: category || 'BusinessApplication',
      operatingSystem: type === 'Mobile' ? 'Android, iOS' : 'Web',
      url,
      image,
      ...(price && {
        offers: {
          '@type': 'Offer',
          price: price.toString(),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      }),
      ...(rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          bestRating: '5',
          worstRating: '1',
          ratingCount: '100',
        },
      }),
      publisher: {
        '@type': 'Organization',
        name: 'SaaS Vala',
        url: 'https://softwarewalanet.lovable.app',
      },
    };

    let scriptEl = document.getElementById('product-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'product-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    return () => {
      // Cleanup JSON-LD on unmount
      const el = document.getElementById('product-jsonld');
      if (el) el.remove();
    };
  }, [title, description, keywords, image, url, productName, category, type, price, rating]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

export default ProductSEOHead;
