
import React from 'react';
import Header from '@/components/Header';
import AssetsList from '@/components/AssetsList';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cryptocurrency Market</h1>
          <p className="text-xl">Track top cryptocurrencies by market capitalization</p>
        </div>
        
        <AssetsList />
      </main>
    </div>
  );
};

export default Index;
