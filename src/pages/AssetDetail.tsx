
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAsset, getAssetHistory, formatCurrency, formatLargeNumber, formatPercentChange } from '../services/coinCapService';
import { Button } from '@/components/ui/button';
import AssetPriceChart from '@/components/AssetPriceChart';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';

type TimeInterval = 'h1' | 'h12' | 'd1' | 'w1' | 'm1';

interface TimeOption {
  label: string;
  value: TimeInterval;
  days: number;
}

const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeInterval, setTimeInterval] = useState<TimeOption>({
    label: '7D',
    value: 'd1',
    days: 7
  });
  
  const timeOptions: TimeOption[] = [
    { label: '24H', value: 'h1', days: 1 },
    { label: '7D', value: 'd1', days: 7 },
    { label: '30D', value: 'd1', days: 30 },
    { label: '90D', value: 'd1', days: 90 },
    { label: '1Y', value: 'd1', days: 365 },
  ];

  const { data: asset, isLoading: isLoadingAsset, isError: isAssetError } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => getAsset(id!),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });

  const end = Date.now();
  const start = end - timeInterval.days * 24 * 60 * 60 * 1000; // Convert days to milliseconds

  const { data: history, isLoading: isLoadingHistory, isError: isHistoryError } = useQuery({
    queryKey: ['assetHistory', id, timeInterval.value, start, end],
    queryFn: () => getAssetHistory(id!, timeInterval.value, start, end),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleTimeChange = (option: TimeOption) => {
    setTimeInterval(option);
  };

  const isPositiveChange = asset && parseFloat(asset.changePercent24Hr) >= 0;
  const chartColor = isPositiveChange ? '#22c55e' : '#ef4444';

  if (isLoadingAsset || isLoadingHistory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="brutal-card p-8 flex justify-center items-center">
          <div className="text-2xl font-bold">Loading asset data...</div>
        </div>
      </div>
    );
  }

  if (isAssetError || isHistoryError || !asset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="brutal-card p-8 bg-red-100">
          <div className="text-2xl font-bold mb-4">Error loading asset</div>
          <p className="mb-4">There was a problem fetching the cryptocurrency data. Please try again later.</p>
          <Button onClick={handleBack} className="brutal-btn">
            <ArrowLeft className="mr-2" size={16} /> Back to Assets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBack} className="brutal-btn mb-6 flex items-center">
        <ArrowLeft size={16} className="mr-2" /> Back to Assets
      </Button>
      
      <div className="brutal-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brutalist-black text-brutalist-white font-bold text-xl rounded-full mr-3">
                {asset.symbol.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{asset.name}</h1>
                <p className="text-lg font-mono">{asset.symbol}</p>
              </div>
              <div className="ml-auto">
                <div className="border-2 border-brutalist-black px-3 py-1 font-bold">
                  Rank #{asset.rank}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-4xl font-bold font-mono mb-2">
                {formatCurrency(asset.priceUsd)}
              </div>
              <div className={`flex items-center text-lg ${isPositiveChange ? 'value-up' : 'value-down'}`}>
                {isPositiveChange ? <TrendingUp size={20} className="mr-2" /> : <TrendingDown size={20} className="mr-2" />}
                {formatPercentChange(asset.changePercent24Hr)} (24h)
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="brutal-card p-4 bg-brutalist-light-gray">
              <div className="text-sm">Market Cap</div>
              <div className="text-xl font-bold font-mono">{formatCurrency(asset.marketCapUsd)}</div>
            </div>
            <div className="brutal-card p-4 bg-brutalist-light-gray">
              <div className="text-sm">24h Volume</div>
              <div className="text-xl font-bold font-mono">{formatCurrency(asset.volumeUsd24Hr)}</div>
            </div>
            <div className="brutal-card p-4 bg-brutalist-light-gray">
              <div className="text-sm">Supply</div>
              <div className="text-xl font-bold font-mono">{formatLargeNumber(asset.supply)} {asset.symbol}</div>
            </div>
            <div className="brutal-card p-4 bg-brutalist-light-gray">
              <div className="text-sm">Max Supply</div>
              <div className="text-xl font-bold font-mono">
                {asset.maxSupply ? `${formatLargeNumber(asset.maxSupply)} ${asset.symbol}` : 'No limit'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Price Chart</h2>
          <div className="flex space-x-2">
            {timeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleTimeChange(option)}
                className={`px-3 py-1 border-2 border-brutalist-black font-bold ${
                  timeInterval.label === option.label 
                    ? 'bg-brutalist-black text-brutalist-white' 
                    : 'bg-brutalist-white text-brutalist-black'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {history && history.length > 0 ? (
          <AssetPriceChart history={history} color={chartColor} />
        ) : (
          <div className="brutal-card p-8 text-center">
            <p className="text-xl font-bold">No price data available for the selected time period</p>
          </div>
        )}
      </div>
      
      <div className="brutal-card p-6">
        <h2 className="text-2xl font-bold mb-4">About {asset.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="brutal-card p-4 bg-brutalist-light-gray">
            <h3 className="font-bold mb-2">Links</h3>
            {asset.explorer && (
              <a 
                href={asset.explorer} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center border-b border-black py-2 hover:bg-white"
              >
                <span className="font-bold mr-2">Explorer:</span> 
                <span className="truncate underline">{asset.explorer}</span>
              </a>
            )}
            <a 
              href={`https://www.google.com/search?q=${asset.name} crypto`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center border-b border-black py-2 hover:bg-white"
            >
              <span className="font-bold mr-2">Search:</span>
              <span className="underline">Google {asset.name}</span>
            </a>
          </div>
          <div className="brutal-card p-4 bg-brutalist-light-gray">
            <h3 className="font-bold mb-2">Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-bold">Symbol:</div>
              <div>{asset.symbol}</div>
              <div className="font-bold">Price:</div>
              <div>{formatCurrency(asset.priceUsd)}</div>
              <div className="font-bold">VWAP (24h):</div>
              <div>{formatCurrency(asset.vwap24Hr)}</div>
              <div className="font-bold">Change (24h):</div>
              <div className={isPositiveChange ? 'value-up' : 'value-down'}>
                {formatPercentChange(asset.changePercent24Hr)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
