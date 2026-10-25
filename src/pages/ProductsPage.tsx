import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface ProductsPageProps {
  initialCategoryId?: string;
  onSelectProduct: (product: Product) => void;
  externalSearch?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategoryId,
  onSelectProduct,
  externalSearch = ''
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearch);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'discount'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync external search prop if changed
  React.useEffect(() => {
    if (externalSearch) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  // Sync initialCategoryId if changed
  React.useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  // Unique sizes from all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.sizes) p.sizes.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Active status check
      if (!p.is_active) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }

      // Search query (Hindi name, English name, SKU)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNameHi = p.name_hi.toLowerCase().includes(q);
        const matchNameEn = p.name_en ? p.name_en.toLowerCase().includes(q) : false;
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchDesc = p.description_hi.toLowerCase().includes(q);
        if (!matchNameHi && !matchNameEn && !matchSku && !matchDesc) {
          return false;
        }
      }

      // Price range
      if (selectedPriceRange === 'under-1500' && p.price >= 1500) return false;
      if (selectedPriceRange === '1500-3000' && (p.price < 1500 || p.price > 3000)) return false;
      if (selectedPriceRange === '3000-5000' && (p.price < 3000 || p.price > 5000)) return false;
      if (selectedPriceRange === 'above-5000' && p.price < 5000) return false;

      // Size filter
      if (selectedSize !== 'all' && (!p.sizes || !p.sizes.includes(selectedSize))) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedCategory, searchQuery, selectedPriceRange, selectedSize, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== 'all' || selectedSize !== 'all' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedSize('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917]">
            {selectedCategory !== 'all'
              ? categories.find(c => c.id === selectedCategory)?.name_hi || "सभी कपड़े"
              : "हमारा पूरा कपड़ा कलेक्शन"}
          </h1>
          <p className="text-xs sm:text-sm text-[#786C5E] font-hindi mt-1">
            {filteredProducts.length} परिधान उपलब्ध हैं
          </p>
        </div>

        {/* Search & Sort Controls (Desktop & Mobile) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#8C7A68] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="कपड़े या SKU खोजें..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#8C7A68] hover:text-[#1C1917]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-[#D5C7B8] rounded-lg font-hindi text-[#1C1917] focus:outline-none focus:border-[#9A6B1F]"
          >
            <option value="newest">क्रम: सबसे नए पहले</option>
            <option value="price-asc">कीमत: कम से ज्यादा</option>
            <option value="price-desc">कीमत: ज्यादा से कम</option>
            <option value="discount">अधिकतम छूट पहले</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#D5C7B8] rounded-lg text-xs font-semibold font-hindi text-[#1C1917]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#9A6B1F]" />
            <span>फ़िल्टर</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Segmented control per guidelines) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
          }`}
        >
          सभी कपड़े
        </button>
        {categories.filter(c => c.is_active).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
            }`}
          >
            {cat.name_hi}
          </button>
        ))}
      </div>

      {/* Main Content Layout with Sidebar Filters for Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className={`md:block space-y-5 bg-white p-4 sm:p-5 rounded-xl border border-[#E8DFD5] ${
          mobileFilterOpen ? 'block' : 'hidden'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#9A6B1F]" />
              <h3 className="text-sm font-bold font-hindi text-[#1C1917]">फ़िल्टर (Filters)</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#B91C1C] hover:underline flex items-center gap-1 font-hindi"
              >
                <RotateCcw className="w-3 h-3" />
                <span>हटाएं</span>
              </button>
            )}
          </div>

          {/* 1. Price Range Filter */}
          <div>
            <h4 className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider mb-2 font-hindi">
              कीमत दायरा (Price Range)
            </h4>
            <div className="space-y-1.5 text-xs font-hindi">
              {[
                { id: 'all', label: 'सभी कीमतें' },
                { id: 'under-1500', label: '₹1,500 से कम' },
                { id: '1500-3000', label: '₹1,500 - ₹3,000' },
                { id: '3000-5000', label: '₹3,000 - ₹5,000' },
                { id: 'above-5000', label: '₹5,000 से अधिक' }
              ].map((range) => (
                <label key={range.id} className="flex items-center gap-2 cursor-pointer text-[#44403C]">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={() => setSelectedPriceRange(range.id)}
                    className="text-[#9A6B1F] focus:ring-[#9A6B1F]"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Size Filter */}
          {allSizes.length > 0 && (
            <div className="pt-3 border-t border-[#E8DFD5]">
              <h4 className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider mb-2 font-hindi">
                साइज़ (Size)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize('all')}
                  className={`px-2.5 py-1 text-xs rounded border ${
                    selectedSize === 'all'
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#44403C] border-[#D5C7B8]'
                  }`}
                >
                  सभी
                </button>
                {allSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 text-xs rounded border ${
                      selectedSize === size
                        ? 'bg-[#1C1917] text-white border-[#1C1917]'
                        : 'bg-white text-[#44403C] border-[#D5C7B8]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Close for mobile */}
          <div className="md:hidden pt-3 border-t border-[#E8DFD5]">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2 bg-[#1C1917] text-white text-xs font-bold rounded-lg"
            >
              परिणाम देखें ({filteredProducts.length})
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DFD5] p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8DFD5] flex items-center justify-center text-[#8C7A68] mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-hindi text-[#1C1917]">
                  कोई कपड़ा नहीं मिला
                </h3>
                <p className="text-xs sm:text-sm text-[#786C5E] mt-1 font-hindi max-w-sm mx-auto">
                  आपके द्वारा चुने गए फ़िल्टर या खोज शब्द के अनुसार कोई परिधान उपलब्ध नहीं है।
                </p>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-bold font-hindi rounded-lg hover:bg-[#2E2824] transition-colors"
              >
                सभी फ़िल्टर हटाएं
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
