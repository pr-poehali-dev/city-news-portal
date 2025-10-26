import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  type?: 'website' | 'article';
  url?: string;
}

export const SEO = ({
  title = 'Город говорит — новостной портал Краснодара',
  description = 'Актуальные новости Краснодара: политика, экономика, культура, спорт, СВО. Читайте последние события города каждый день.',
  image = 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/eb987673-3184-4113-ba7d-4352a83d6cf7.jpg?v=2',
  article,
  type = 'website',
  url = 'https://ggkrasnodar.ru/'
}: SEOProps) => {
  const siteTitle = 'Город говорит';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      <link rel="canonical" href={url} />
      
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ru_RU" />
      
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'NewsArticle' : 'WebSite',
          "name": siteTitle,
          "headline": title,
          "description": description,
          "url": url,
          "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 630
          },
          ...(type === 'article' && article ? {
            "datePublished": article.publishedTime,
            "dateModified": article.modifiedTime || article.publishedTime,
            "author": {
              "@type": "Organization",
              "name": article.author || siteTitle
            },
            "publisher": {
              "@type": "Organization",
              "name": siteTitle,
              "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/d3c8aa3c-b9de-4bbc-9dd3-a5fbd1d4e30a.jpg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          } : {
            "publisher": {
              "@type": "Organization",
              "name": siteTitle,
              "url": "https://ggkrasnodar.ru/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/d3c8aa3c-b9de-4bbc-9dd3-a5fbd1d4e30a.jpg"
              }
            }
          })
        })}
      </script>
    </Helmet>
  );
};
