import React from 'react';
import { Title, Meta, Link } from 'react-head';
import { seoConfig } from '../config/seo.config';

/**

* Componente SEO para gestionar meta tags
  */
  const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  }) => {
  const fullTitle = title
  ? `${title} | ${seoConfig.siteName}`
  : seoConfig.siteName;

const metaDescription = description || seoConfig.siteDescription;

const metaKeywords = keywords
? [...seoConfig.defaultKeywords, ...keywords.split(',').map(k => k.trim())]
: seoConfig.defaultKeywords;

const ogImage = image
? (image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`)
: `${seoConfig.siteUrl}${seoConfig.defaultImage}`;

const canonicalUrl = url || seoConfig.siteUrl;

return (
<>
{/* Título */} <Title>{fullTitle}</Title>

```
  {/* Meta básicas */}
  <Meta name="description" content={metaDescription} />
  <Meta name="keywords" content={metaKeywords.join(', ')} />

  {/* Control indexación */}
  {noIndex && <Meta name="robots" content="noindex, nofollow" />}

  {/* Canonical */}
  <Link rel="canonical" href={canonicalUrl} />

  {/* Open Graph */}
  <Meta property="og:type" content={type} />
  <Meta property="og:title" content={fullTitle} />
  <Meta property="og:description" content={metaDescription} />
  <Meta property="og:image" content={ogImage} />
  <Meta property="og:url" content={canonicalUrl} />
  <Meta property="og:site_name" content={seoConfig.siteName} />
  <Meta property="og:locale" content={seoConfig.locale} />

  {/* Twitter */}
  <Meta name="twitter:card" content="summary_large_image" />
  <Meta name="twitter:title" content={fullTitle} />
  <Meta name="twitter:description" content={metaDescription} />
  <Meta name="twitter:image" content={ogImage} />
  {seoConfig.social.twitter && (
    <Meta name="twitter:site" content={seoConfig.social.twitter} />
  )}

  {/* Idioma */}
  <html lang={seoConfig.language} />
</>


);
};

export default SEO;
