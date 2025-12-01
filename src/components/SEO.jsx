import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../config/seo.config';

/**
 * Componente SEO reutilizable para gestionar meta tags
 * @param {string} title - Título de la página
 * @param {string} description - Descripción meta
 * @param {string} keywords - Palabras clave (opcional)
 * @param {string} image - URL de imagen para Open Graph (opcional)
 * @param {string} url - URL canónica (opcional)
 * @param {string} type - Tipo de contenido: website, article, product (default: website)
 * @param {boolean} noIndex - Si true, añade noindex/nofollow (default: false)
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
  // Construir título completo
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.siteName;
  
  // Usar descripción por defecto si no se proporciona
  const metaDescription = description || seoConfig.siteDescription;
  
  // Combinar keywords personalizadas con las por defecto
  const metaKeywords = keywords 
    ? [...seoConfig.defaultKeywords, ...keywords.split(',').map(k => k.trim())]
    : seoConfig.defaultKeywords;
  
  // Imagen para Open Graph
  const ogImage = image 
    ? (image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`)
    : `${seoConfig.siteUrl}${seoConfig.defaultImage}`;
  
  // URL canónica
  const canonicalUrl = url || seoConfig.siteUrl;

  return (
    <Helmet>
      {/* Título de la página */}
      <title>{fullTitle}</title>
      
      {/* Meta tags básicos */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords.join(', ')} />
      
      {/* Control de indexación */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* URL canónica */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph para Facebook/LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      {seoConfig.social.twitter && (
        <meta name="twitter:site" content={seoConfig.social.twitter} />
      )}
      
      {/* Idioma */}
      <html lang={seoConfig.language} />
    </Helmet>
  );
};

export default SEO;
