import { useEffect } from 'react';

const WWWRedirect = () => {
  useEffect(() => {
    // Only run in production and in browser
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      const currentProtocol = window.location.protocol;
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      
      // If we're on the non-www version, redirect to www
      if (currentHost === 'skdpropworld.com') {
        const newURL = `https://www.skdpropworld.com${currentPath}`;
        window.location.replace(newURL);
        return;
      }
      
      // If we're on HTTP, redirect to HTTPS
      if (currentProtocol === 'http:' && currentHost.includes('skdpropworld.com')) {
        const newURL = `https://www.skdpropworld.com${currentPath}`;
        window.location.replace(newURL);
        return;
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default WWWRedirect;