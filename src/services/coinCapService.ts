
// Types for CoinCap API responses
export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

export interface AssetsResponse {
  data: Asset[];
  timestamp: number;
}

export interface AssetResponse {
  data: Asset;
  timestamp: number;
}

export interface AssetHistoryResponse {
  data: AssetHistory[];
  timestamp: number;
}

const BASE_URL = "https://api.coincap.io/v2";

// API Key - if you have one, otherwise leave empty
const API_KEY = "";

// Configure fetch options for CoinCap API
const getHeaders = () => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  // Add API key if available
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }
  
  return headers;
};

// Get top assets sorted by rank (market cap)
export const getAssets = async (limit: number = 20, offset: number = 0): Promise<Asset[]> => {
  try {
    const response = await fetch(`${BASE_URL}/assets?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status} ${response.statusText}`);
    }
    const data: AssetsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
};

// Get a specific asset by id
export const getAsset = async (id: string): Promise<Asset | null> => {
  try {
    const response = await fetch(`${BASE_URL}/assets/${id}`, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset ${id}: ${response.status} ${response.statusText}`);
    }
    const data: AssetResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    return null;
  }
};

// Get price history for an asset
export const getAssetHistory = async (
  id: string,
  interval: "m1" | "m5" | "m15" | "m30" | "h1" | "h2" | "h6" | "h12" | "d1" = "d1",
  start?: number,
  end?: number
): Promise<AssetHistory[]> => {
  try {
    let url = `${BASE_URL}/assets/${id}/history?interval=${interval}`;
    
    if (start) {
      url += `&start=${start}`;
    }
    
    if (end) {
      url += `&end=${end}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for asset ${id}: ${response.status} ${response.statusText}`);
    }
    const data: AssetHistoryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    return [];
  }
};

// Get mock assets data when API fails (for development)
export const getMockAssets = (): Asset[] => {
  return [
    {
      id: "bitcoin",
      rank: "1",
      symbol: "BTC",
      name: "Bitcoin",
      supply: "19000000",
      maxSupply: "21000000",
      marketCapUsd: "1000000000000",
      volumeUsd24Hr: "30000000000",
      priceUsd: "52000",
      changePercent24Hr: "2.5",
      vwap24Hr: "51500",
      explorer: "https://blockchain.info/"
    },
    {
      id: "ethereum",
      rank: "2",
      symbol: "ETH",
      name: "Ethereum",
      supply: "120000000",
      maxSupply: null,
      marketCapUsd: "400000000000",
      volumeUsd24Hr: "20000000000",
      priceUsd: "3100",
      changePercent24Hr: "-0.8",
      vwap24Hr: "3150",
      explorer: "https://etherscan.io/"
    },
    {
      id: "solana",
      rank: "4",
      symbol: "SOL",
      name: "Solana",
      supply: "555000000",
      maxSupply: null,
      marketCapUsd: "60000000000",
      volumeUsd24Hr: "5000000000",
      priceUsd: "110",
      changePercent24Hr: "3.2",
      vwap24Hr: "108",
      explorer: "https://explorer.solana.com/"
    }
  ];
};

// Format currency (USD)
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "$0.00";
  }
  
  // For values less than 1 cent, show more decimal places
  if (Math.abs(numValue) < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    }).format(numValue);
  }
  
  // For values less than $1, show 4 decimal places
  if (Math.abs(numValue) < 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(numValue);
  }
  
  // For values less than $1000, use standard 2 decimal places
  if (Math.abs(numValue) < 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }
  
  // For larger values, use commas and less precision
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Math.abs(numValue) >= 1000000 ? "compact" : "standard",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numValue);
};

// Format large numbers (like market cap, volume)
export const formatLargeNumber = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "0";
  }
  
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(numValue);
};

// Format percentage change
export const formatPercentChange = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "0.00%";
  }
  
  return `${numValue >= 0 ? "+" : ""}${numValue.toFixed(2)}%`;
};
