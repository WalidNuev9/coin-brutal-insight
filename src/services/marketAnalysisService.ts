
import { AssetHistory } from './coinCapService';

// Simple moving average calculation
export const calculateSMA = (data: number[], period: number): number => {
  if (data.length < period) return NaN;
  const sum = data.slice(data.length - period).reduce((total, value) => total + value, 0);
  return sum / period;
};

// Exponential moving average calculation
export const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const emaResults: number[] = [];
  let ema = data[0];
  
  for (let i = 0; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaResults.push(ema);
  }
  
  return emaResults;
};

// Calculate relative strength index (RSI)
export const calculateRSI = (data: number[], period: number = 14): number => {
  if (data.length <= period) return 50; // default to neutral if not enough data
  
  let gains = 0;
  let losses = 0;
  
  for (let i = data.length - period; i < data.length; i++) {
    const difference = data[i] - data[i - 1];
    if (difference > 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }
  
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
};

// Function to analyze price trends and make a simple prediction
export const analyzeTrend = (history: AssetHistory[]): {
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  prediction: string;
  metrics: {
    rsi: number;
    shortTermAvg: number;
    longTermAvg: number;
    volatility: number;
  };
} => {
  if (!history || history.length < 30) {
    return {
      trend: 'neutral',
      confidence: 0,
      prediction: 'Insufficient data for analysis',
      metrics: {
        rsi: 50,
        shortTermAvg: 0,
        longTermAvg: 0,
        volatility: 0
      }
    };
  }
  
  // Extract price data
  const prices = history.map(item => parseFloat(item.priceUsd));
  
  // Calculate metrics
  const shortTermPeriod = 7;
  const longTermPeriod = 21;
  
  const shortTermAvg = calculateSMA(prices, shortTermPeriod);
  const longTermAvg = calculateSMA(prices, longTermPeriod);
  
  // Calculate price volatility (standard deviation)
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
  const volatility = Math.sqrt(variance) / mean * 100; // volatility as percentage of mean
  
  // Calculate RSI
  const rsi = calculateRSI(prices);
  
  // Determine trend
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 0;
  let predictionText = '';
  
  if (shortTermAvg > longTermAvg && rsi < 70) {
    trend = 'bullish';
    confidence = Math.min(((shortTermAvg / longTermAvg) - 1) * 100, 90);
    
    if (rsi > 65) {
      predictionText = 'Potential overbought conditions, but still in uptrend';
      confidence *= 0.8;
    } else if (rsi < 40) {
      predictionText = 'Potential recovery or start of uptrend';
      confidence *= 0.7;
    } else {
      predictionText = 'Bullish trend likely to continue';
    }
  } else if (shortTermAvg < longTermAvg && rsi > 30) {
    trend = 'bearish';
    confidence = Math.min(((longTermAvg / shortTermAvg) - 1) * 100, 90);
    
    if (rsi < 35) {
      predictionText = 'Potential oversold conditions, but still in downtrend';
      confidence *= 0.8;
    } else if (rsi > 60) {
      predictionText = 'Potential reversal or start of downtrend';
      confidence *= 0.7;
    } else {
      predictionText = 'Bearish trend likely to continue';
    }
  } else {
    trend = 'neutral';
    confidence = Math.min(100 - Math.abs((shortTermAvg / longTermAvg - 1) * 200), 70);
    predictionText = 'Market in consolidation, no clear trend';
  }
  
  // Add volatility to the analysis
  if (volatility > 10) {
    predictionText += '. High volatility indicates potential for large price swings';
    confidence *= 0.9;
  } else if (volatility < 3) {
    predictionText += '. Low volatility might precede a significant price movement';
    confidence *= 0.95;
  }
  
  return {
    trend,
    confidence: Math.round(confidence),
    prediction: predictionText,
    metrics: {
      rsi: Math.round(rsi),
      shortTermAvg,
      longTermAvg,
      volatility: Math.round(volatility * 100) / 100
    }
  };
};
