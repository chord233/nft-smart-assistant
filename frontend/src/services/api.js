import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const nftAPI = {
  // Get NFT price prediction
  getPricePrediction: async (contractAddress, tokenId, blockchain = 'ethereum') => {
    try {
      const response = await api.get('/api/nft/price-prediction', {
        params: {
          contract_address: contractAddress,
          token_id: tokenId,
          blockchain: blockchain
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get price prediction');
    }
  },

  // Get collection analysis
  getCollectionAnalysis: async (contractAddress, blockchain = 'ethereum') => {
    try {
      const response = await api.get('/api/nft/collection-analysis', {
        params: {
          contract_address: contractAddress,
          blockchain: blockchain
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get collection analysis');
    }
  },

  // Detect wash trading
  detectWashTrading: async (contractAddress, tokenId, blockchain = 'ethereum') => {
    try {
      const response = await api.get('/api/nft/wash-trading-detection', {
        params: {
          contract_address: contractAddress,
          token_id: tokenId,
          blockchain: blockchain
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to detect wash trading');
    }
  },

  // Detect forgery
  detectForgery: async (contractAddress, tokenId, blockchain = 'ethereum') => {
    try {
      const response = await api.get('/api/nft/forgery-detection', {
        params: {
          contract_address: contractAddress,
          token_id: tokenId,
          blockchain: blockchain
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to detect forgery');
    }
  },

  // Get comprehensive NFT analysis
  getComprehensiveAnalysis: async (contractAddress, tokenId, blockchain = 'ethereum') => {
    try {
      const [priceData, washTradingData, forgeryData] = await Promise.allSettled([
        nftAPI.getPricePrediction(contractAddress, tokenId, blockchain),
        nftAPI.detectWashTrading(contractAddress, tokenId, blockchain),
        nftAPI.detectForgery(contractAddress, tokenId, blockchain)
      ]);

      return {
        price: priceData.status === 'fulfilled' ? priceData.value : null,
        washTrading: washTradingData.status === 'fulfilled' ? washTradingData.value : null,
        forgery: forgeryData.status === 'fulfilled' ? forgeryData.value : null,
        errors: {
          price: priceData.status === 'rejected' ? priceData.reason.message : null,
          washTrading: washTradingData.status === 'rejected' ? washTradingData.reason.message : null,
          forgery: forgeryData.status === 'rejected' ? forgeryData.reason.message : null
        }
      };
    } catch (error) {
      throw new Error('Failed to get comprehensive analysis');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  }
};

// Utility functions
export const utils = {
  // Validate Ethereum address
  isValidAddress: (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Validate token ID
  isValidTokenId: (tokenId) => {
    return /^\d+$/.test(tokenId) && parseInt(tokenId) >= 0;
  },

  // Format price with currency
  formatPrice: (price, currency = 'ETH') => {
    if (typeof price !== 'number') return 'N/A';
    return `${price.toFixed(4)} ${currency}`;
  },

  // Format percentage
  formatPercentage: (value) => {
    if (typeof value !== 'number') return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  },

  // Get blockchain display name
  getBlockchainDisplayName: (blockchain) => {
    const names = {
      ethereum: 'Ethereum',
      polygon: 'Polygon',
      bsc: 'BSC',
      solana: 'Solana'
    };
    return names[blockchain] || blockchain;
  },

  // Get risk level color
  getRiskColor: (riskLevel) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336'
    };
    return colors[riskLevel?.toLowerCase()] || '#666';
  },

  // Truncate address for display
  truncateAddress: (address, startLength = 6, endLength = 4) => {
    if (!address) return '';
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }
};

export default api;