import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, ShoppingBag } from 'lucide-react';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToProducts: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onNavigateToProducts }) => {
  const { products, wishlist } = useStore();

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-[#E8DFD5] flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917] flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#B91C1C] fill-[#B91C1C]" />
            <span>मेरी पसंद (Saved Clothes)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#786C5E] font-hindi mt-1">
            आपके द्वारा सुरक्षित किए गए पसंदीदा परिधान ({favoriteProducts.length})
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-[#8C7A68] mx-auto opacity-40" />
          <h2 className="text-lg font-bold font-hindi text-[#1C1917]">
            आपकी पसंद सूची अभी खाली है
          </h2>
          <p className="text-xs text-[#786C5E] font-hindi max-w-sm mx-auto">
            कपड़ा देखते समय दिल (Heart) आइकन पर टैप करके आप उसे अपनी पसंद सूची में रख सकते हैं।
          </p>
          <button
            onClick={onNavigateToProducts}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-bold font-hindi rounded-lg hover:bg-[#2E2824] transition-colors"
          >
            कपड़े देखना शुरू करें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
