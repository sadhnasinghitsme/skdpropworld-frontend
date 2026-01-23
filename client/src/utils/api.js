// API utility functions for handling environment-specific URLs

/**
 * Get the API base URL, handling both development and production environments
 * In production with Vercel, returns empty string to use relative URLs with rewrites
 * In development, returns the full localhost URL
 */
export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl;
};

/**
 * Construct a full API URL for the given endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/api/lead/submit')
 * @returns {string} - The full URL or relative URL depending on environment
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
 * Make an API request with proper URL handling
 * @param {string} endpoint - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const apiRequest = (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  console.log(`API Request: ${url}`);
  
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};