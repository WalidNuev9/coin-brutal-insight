
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="bg-brutalist-black text-brutalist-white px-4 py-2 text-2xl font-bold mr-2">
              CRYPTO
            </div>
            <div className="border-2 border-brutalist-black px-4 py-2 text-2xl font-bold">
              TRACKER
            </div>
          </Link>
          
          <div className="flex items-center">
            <div className="bg-brutalist-accent-yellow border-2 border-brutalist-black text-brutalist-black font-bold p-2 shadow-brutal-sm">
              NEO BRUTALIST
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
