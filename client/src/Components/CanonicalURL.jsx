import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const CanonicalURL = () => {
  const location = useLocation();
  
  // Base URL - always use www version
  const baseURL = "https://www.skdpropworld.com";
  
  // Get current path
  const currentPath = location.pathname;
  
  // Construct canonical URL
  const canonicalURL = `${baseURL}${currentPath}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalURL} />
      
      {/* Add alternate URLs for SEO */}
      <link rel="alternate" hreflang="en" href={canonicalURL} />
      <link rel="alternate" hreflang="en-IN" href={canonicalURL} />
      
      {/* Prevent indexing of non-www version */}
      {typeof window !== 'undefined' && window.location.hostname === 'skdpropworld.com' && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </Helmet>
  );
};

export default CanonicalURL;