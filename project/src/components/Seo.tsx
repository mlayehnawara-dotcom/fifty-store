import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Fifty Store';
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || 'https://fifty-store.tn';
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE }: SeoProps) {
  const pageTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_TN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
