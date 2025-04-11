
import React from 'react';
import { AssetHistory } from '../services/coinCapService';
import { analyzeTrend } from '../services/marketAnalysisService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Gauge } from 'lucide-react';

interface MarketPredictionProps {
  history: AssetHistory[];
  symbol: string;
}

const MarketPrediction: React.FC<MarketPredictionProps> = ({ history, symbol }) => {
  const analysis = analyzeTrend(history);
  
  const trendColors = {
    bullish: '#22c55e',
    bearish: '#ef4444',
    neutral: '#f59e0b'
  };
  
  const trendIcons = {
    bullish: <TrendingUp size={24} className="mr-2" />,
    bearish: <TrendingDown size={24} className="mr-2" />,
    neutral: <AlertTriangle size={24} className="mr-2" />
  };
  
  // Calculate EMA data for the chart
  const chartData = React.useMemo(() => {
    if (history.length < 30) return [];
    
    const prices = history.map(item => parseFloat(item.priceUsd));
    const dates = history.map(item => new Date(item.time).toLocaleDateString());
    
    const ema7 = prices.slice(0, 7).reduce((sum, price) => sum + price, 0) / 7;
    const ema21 = prices.slice(0, 21).reduce((sum, price) => sum + price, 0) / 21;
    
    return history.slice(21).map((item, index) => {
      const date = new Date(item.time).toLocaleDateString();
      const price = parseFloat(item.priceUsd);
      const i = index + 21; // adjusted index
      
      return {
        date,
        price,
        ema7: analysis.metrics.shortTermAvg,
        ema21: analysis.metrics.longTermAvg
      };
    });
  }, [history, analysis]);

  return (
    <div className="brutal-card p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Market Analysis & Prediction</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="brutal-card p-4 bg-brutalist-light-gray">
          <div className="flex items-center mb-4">
            <div className={`text-${analysis.trend === 'bullish' ? 'green' : analysis.trend === 'bearish' ? 'red' : 'yellow'}-600`}>
              {trendIcons[analysis.trend]}
            </div>
            <h3 className="text-xl font-bold">Market Sentiment</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-bold">Trend:</span>
              <span className={`font-mono ${
                analysis.trend === 'bullish' 
                  ? 'text-green-600' 
                  : analysis.trend === 'bearish' 
                    ? 'text-red-600' 
                    : 'text-yellow-600'
              }`}>
                {analysis.trend.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span className="font-bold">Confidence:</span>
              <span className="font-mono">{analysis.confidence}%</span>
            </div>
            
            <div className="w-full bg-brutalist-white h-4 border-2 border-brutalist-black mt-2">
              <div 
                className={`h-full ${
                  analysis.trend === 'bullish' 
                    ? 'bg-green-600' 
                    : analysis.trend === 'bearish' 
                      ? 'bg-red-600' 
                      : 'bg-yellow-600'
                }`}
                style={{ width: `${analysis.confidence}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border-t-2 border-brutalist-black pt-4 mt-4">
            <p className="font-bold mb-2">AI Prediction:</p>
            <p>{analysis.prediction}</p>
          </div>
        </div>
        
        <div className="brutal-card p-4 bg-brutalist-light-gray">
          <h3 className="text-xl font-bold mb-4">Technical Indicators</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-bold mb-1">RSI</p>
              <div className="brutal-card p-3 bg-white">
                <div className="flex items-center">
                  <Gauge size={16} className="mr-2" />
                  <span className="text-lg font-mono font-bold">{analysis.metrics.rsi}</span>
                </div>
                <div className="mt-1 text-xs">
                  {analysis.metrics.rsi > 70 ? (
                    <span className="text-red-500">Overbought</span>
                  ) : analysis.metrics.rsi < 30 ? (
                    <span className="text-green-500">Oversold</span>
                  ) : (
                    <span>Neutral</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold mb-1">Volatility</p>
              <div className="brutal-card p-3 bg-white">
                <div className="flex items-center">
                  <span className="text-lg font-mono font-bold">{analysis.metrics.volatility}%</span>
                </div>
                <div className="mt-1 text-xs">
                  {analysis.metrics.volatility > 8 ? (
                    <span className="text-red-500">High</span>
                  ) : analysis.metrics.volatility < 3 ? (
                    <span className="text-green-500">Low</span>
                  ) : (
                    <span>Medium</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold mb-1">7-Day EMA</p>
              <div className="brutal-card p-3 bg-white">
                <div className="font-mono font-bold">
                  ${analysis.metrics.shortTermAvg.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold mb-1">21-Day EMA</p>
              <div className="brutal-card p-3 bg-white">
                <div className="font-mono font-bold">
                  ${analysis.metrics.longTermAvg.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs mt-4">
            <p className="font-bold">Disclaimer:</p>
            <p>This is a simple analysis for educational purposes only. Not financial advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPrediction;
