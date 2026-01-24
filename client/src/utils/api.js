// API utility functions for handling environment-specific URLs

/**
 * Get the API base URL, handling both development and production environments
 * In production with Vercel rewrites, can be empty to use relative URLs
 * In development, should be the full localhost URL
 */
export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl;
};

/**
 * Construct a full API URL for the given endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/api/lead/submit')
 * @returns {string} - The full URL or relative URL for Vercel rewrites
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  
  // If no base URL (production with Vercel rewrites), use relative URL
  if (!baseUrl) {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  
  // If base URL exists (development), construct full URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Test multiple backend URLs to find a working one
 * @returns {Promise<string>} - Working backend URL or null
 */
export const findWorkingBackend = async () => {
  const backendUrls = [
    'https://yeida-backend.onrender.com',
    'https://skd-backend.onrender.com', 
    'https://www-skdpropworld-com.onrender.com',
    'https://skd-production.up.railway.app'
  ];

  console.log('🔍 Testing backend URLs...');
  
  for (const url of backendUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (response.ok) {
        console.log(`✅ Working backend found: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Failed: ${url} - ${error.message}`);
    }
  }
  
  console.log('🚨 No working backend found');
  return null;
};

/**
 * Make an API request with proper URL handling and error logging
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  console.log(`🚀 API Request: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Log response details for debugging
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText} for ${url}`);
    }
    
    return response;
  } catch (error) {
    console.error(`🔥 Network Error: ${error.message} for ${url}`);
    throw error;
  }
};