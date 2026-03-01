import axios from 'axios';

// Use your proxy backend URL - change this if your proxy runs on a different port
const PROXY_URL = process.env.REACT_APP_API_PROXY || 'http://localhost:3001';

export const searchImages = async (query) => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    console.log('Searching images for:', query); // Debug log
    
    const response = await axios.get(`${PROXY_URL}/api/image-search`, {
      params: { q: query },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Image search response:', response.data); // Debug log
    
    return response.data.items || [];
  } catch (error) {
    console.error('Image search failed:', error);
    
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from proxy server');
      console.error('Make sure your proxy server is running on port 3001');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

// Optional: Add a function to test the connection
export const testProxyConnection = async () => {
  try {
    const response = await axios.get(`${PROXY_URL}/api/image-search?q=test`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};