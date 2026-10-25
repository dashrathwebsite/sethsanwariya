import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface OffersPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToProducts: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onSelectProduct, onNavigateToProducts }) => {
  const { products } = useStore();

  const offerProducts = products.filter(
    (p) => p.is_active && ((p.discount_percent && p.discount_percent > 0) || (p.original_price && p.original_price > p.price))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1917] to-[#3B1F22] text-white rounded-2xl p-6 sm:p-10 border border-[#5A2C31] shadow-lg">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E2B158] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>सीमित समय की छूट</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-hindi">
            खास ऑफर एवं डिस्काउंट वाले कपड़े
          </h1>
          <p className="text-xs sm:text-sm text-[#D5C2AF] font-hindi leading-relaxed">
            विशेष त्योहारी सीजन पर चुनिंदा साड़ियों, कुर्तों और सूट पर 20% से 40% तक की भारी छूट। सीमित स्टॉक उपलब्ध!
          </p>
        </div>
      </div>

      {/* Grid */}
      {offerProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#8C7A68] mx-auto opacity-50" />
          <h2 className="text-lg font-bold font-hindi text-[#1C1917]">
            फिलहाल कोई विशेष ऑफर उपलब्ध नहीं है
          </h2>
          <p className="text-xs text-[#786C5E] font-hindi">
            आप हमारे पूरे कपड़े के कलेक्शन को देख सकते हैं।
          </p>
          <button
            onClick={onNavigateToProducts}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-bold font-hindi rounded-lg"
          >
            सभी कपड़े देखें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {offerProducts.map((product) => (
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
