
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../services/coinCapService';
import AssetListItem from './AssetListItem';
import { Button } from '@/components/ui/button';

const AssetsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { data: assets, isLoading, isError } = useQuery({
    queryKey: ['assets', page],
    queryFn: () => getAssets(limit, (page - 1) * limit),
    staleTime: 60000, // 1 minute
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  if (isLoading) {
    return (
      <div className="brutal-card p-8 flex justify-center items-center">
        <div className="text-2xl font-bold">Loading crypto assets...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="brutal-card p-8 bg-red-100">
        <div className="text-2xl font-bold mb-4">Error loading assets</div>
        <p>There was a problem fetching cryptocurrency data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="brutal-card p-4 mb-4 bg-brutalist-light-gray">
        <div className="grid grid-cols-12 font-bold">
          <div className="col-span-1">#</div>
          <div className="col-span-3 md:col-span-2">Name</div>
          <div className="col-span-3 md:col-span-2">Price</div>
          <div className="col-span-3 md:col-span-2">24h %</div>
          <div className="col-span-2 hidden md:block">Market Cap</div>
          <div className="col-span-2 hidden md:block">Volume (24h)</div>
          <div className="col-span-2 md:col-span-1"></div>
        </div>
      </div>

      {assets && assets.map((asset) => (
        <AssetListItem key={asset.id} asset={asset} />
      ))}

      <div className="flex justify-between mt-8">
        <Button 
          onClick={handlePreviousPage} 
          disabled={page === 1} 
          className="brutal-btn bg-brutalist-black disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="flex items-center px-4 font-bold">Page {page}</span>
        <Button 
          onClick={handleNextPage} 
          className="brutal-btn bg-brutalist-black"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AssetsList;
