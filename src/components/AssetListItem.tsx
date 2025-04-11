
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatLargeNumber, formatPercentChange } from '../services/coinCapService';
import type { Asset } from '../services/coinCapService';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetListItemProps {
  asset: Asset;
}

const AssetListItem: React.FC<AssetListItemProps> = ({ asset }) => {
  const isPositiveChange = parseFloat(asset.changePercent24Hr) >= 0;

  return (
    <Link to={`/asset/${asset.id}`} className="block">
      <div className="brutal-card p-4 mb-4 hover:bg-brutalist-light-gray">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-1 font-mono text-sm">{asset.rank}</div>
          <div className="col-span-3 md:col-span-2 flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-brutalist-black text-brutalist-white font-bold rounded-full mr-2">
              {asset.symbol.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{asset.symbol}</p>
              <p className="text-xs hidden md:block">{asset.name}</p>
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 font-mono font-bold">
            {formatCurrency(asset.priceUsd)}
          </div>
          <div className="col-span-3 md:col-span-2 flex items-center">
            <div className={`flex items-center ${isPositiveChange ? 'value-up' : 'value-down'}`}>
              {isPositiveChange ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {formatPercentChange(asset.changePercent24Hr)}
            </div>
          </div>
          <div className="col-span-2 hidden md:block font-mono">
            {formatLargeNumber(asset.marketCapUsd)}
          </div>
          <div className="col-span-2 hidden md:block font-mono">
            {formatLargeNumber(asset.volumeUsd24Hr)}
          </div>
          <div className="col-span-2 md:col-span-1 flex justify-end">
            <div className="bg-brutalist-black text-brutalist-white px-2 py-1 font-bold text-xs">
              DETAILS
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetListItem;
