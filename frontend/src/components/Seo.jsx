import { Helmet } from "react-helmet-async";

const SEO = ({ 
  title, 
  description, 
  url, 
  image 
}) => {
  const defaultTitle = "Digital Commerce Platform";
  const defaultDescription = "A digital commerce platform for online shopping.";
  const defaultImage = "https://example.com/default-image.jpg";
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://yourwebsite.com";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalUrl = url ? `${baseUrl}${url}` : baseUrl;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;