import { Helmet } from "react-helmet-async";

const SITE_NAME = "Win Academy";
const DEFAULT_DESCRIPTION =
  "Win Academy offers 22+ years of hands-on IT & academic education in Dadu, Sindh, Pakistan. Courses in Programming, AI, Web Development, Mathematics and more.";
const DEFAULT_IMAGE = "/logo.png";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  /** JSON-LD structured data object(s) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Premier Education Institute in Dadu, Sindh`;
  // We use a relative base; the og:url will work once deployed to the real domain
  const siteUrl = "https://winacademy.vercel.app";
  const canonicalUrl = `${siteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
