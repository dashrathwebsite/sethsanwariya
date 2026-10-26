import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreStatusBadge } from './StoreStatusBadge';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  MessageCircle
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, categoryId?: string) => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onReplayIntro
}) => {
  const { settings, cartCount, wishlist, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const officialLogoUrl = settings.logo_url || "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      {/* 1. Store Announcement Bar & Live Shop Status */}
      <aside 
        aria-label="दुकान घोषणा एवं समय"
        className="bg-[#1C1917] text-[#F3E8D8] text-xs py-1.5 px-3 sm:px-4 font-medium tracking-wide flex items-center justify-between gap-1.5 sm:gap-2 w-full max-w-full overflow-hidden"
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <StoreStatusBadge compact />
          <span aria-hidden="true" className="text-[#57534E] hidden sm:inline">|</span>
          <span className="text-[11px] text-[#D5C2AF] hidden md:inline">
            दुकान खुलने का समय: 8:00 AM–10:00 PM (सातों दिन) · कातर छोटी, राजस्थान
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="inline-flex items-center gap-1 text-[#E2B158] hover:text-white transition-colors cursor-pointer text-[11px]"
              title="शाही स्वागत स्क्रीन"
            >
              <Sparkles className="w-3 h-3 text-[#E2B158]" />
              <span className="hidden sm:inline">स्वागत</span>
            </button>
          )}

          <a 
            href="tel:+918529095431"
            className="inline-flex items-center gap-1 text-[#E2B158] hover:underline font-semibold text-[11px] sm:text-xs"
            title="कॉल करें"
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">+91 8529095431</span>
            <span className="sm:hidden">कॉल</span>
          </a>

          <a 
            href="https://wa.me/918529095431"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#4ADE80] hover:underline font-semibold text-[11px] sm:text-xs"
            title="WhatsApp पर चैट करें"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </aside>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8 h-16 sm:h-18">
          
          {/* ZONE 1: Perfectly Circular Official Logo + Brand Wordmark */}
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="text-left group cursor-pointer focus:outline-none min-w-0 flex items-center gap-2 sm:gap-3 shrink"
            aria-label="सेठ सांवरिया कलेक्शन मुख्य पृष्ठ"
          >
            {/* Official circular logo container */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-b from-[#E2B158] via-[#B8860B] to-[#5C4033] shadow-md flex items-center justify-center shrink-0 group-hover:shadow-[0_0_12px_rgba(226,177,88,0.5)] transition-shadow">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/50">
                <img
                  src={officialLogoUrl}
                  alt="SETH SANWARIYA COLLECTION Logo"
                  className="w-full h-full object-contain rounded-full p-0.5 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to text monogram if network fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="min-w-0">
              <span className="text-base sm:text-xl md:text-2xl font-bold font-heading tracking-wide text-[#1C1917] group-hover:text-[#9A6B1F] transition-colors block leading-tight truncate">
                SETH SANWARIYA
              </span>
              <p className="text-[10px] sm:text-[11px] font-hindi text-[#786C5E] font-medium tracking-normal -mt-0.5 truncate">
                कातर छोटी, राजस्थान
              </p>
            </div>
          </button>

          {/* ZONE 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] font-medium text-[#44403C]">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'home' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              होम
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'products' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              सभी कपड़े
            </button>
            <button
              onClick={() => onNavigate('category', 'cat-mens')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'category-cat-mens' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              पुरुष
            </button>
            <button
              onClick={() => onNavigate('category', 'cat-sarees')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'category-cat-sarees' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              महिलाएँ
            </button>
            <button
              onClick={() => onNavigate('offers')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'offers' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              खास ऑफर
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors hover:text-[#9A6B1F] whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'contact' ? 'text-[#9A6B1F] border-[#9A6B1F] font-semibold' : 'border-transparent'
              }`}
            >
              संपर्क
            </button>
          </nav>

          {/* ZONE 3: Primary action cluster */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Box / Button */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-white border border-[#D5C7B8] rounded-full px-2.5 py-1 shadow-xs w-36 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#786C5E] shrink-0 mr-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="खोजें..."
                    className="w-full text-xs font-hindi bg-transparent focus:outline-none text-[#1C1917]"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); onSearchChange(''); }}
                    className="text-[#786C5E] hover:text-[#1C1917] p-0.5"
                    aria-label="खोज बंद करें"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowSearchInput(true); if (currentTab !== 'products') onNavigate('products'); }}
                  className="p-1.5 sm:p-2 text-[#44403C] hover:text-[#9A6B1F] hover:bg-[#F2ECE4] rounded-full transition-colors"
                  aria-label="कपड़े खोजें"
                  title="खोजें"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-1.5 sm:p-2 text-[#44403C] hover:text-[#9A6B1F] hover:bg-[#F2ECE4] rounded-full transition-colors"
              aria-label="मेरी पसंद"
              title="मेरी पसंद"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#B91C1C] text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-[#1C1917] hover:bg-[#2E2824] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              aria-label={`शॉपिंग कार्ट में ${cartCount} वस्तुएं`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#E2B158]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E2B158] text-[#1C1917] text-[9px] sm:text-[10px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-hindi text-xs sm:text-sm font-semibold hidden sm:inline">
                कार्ट
              </span>
            </button>

            {/* Admin Badge */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex items-center gap-1 text-xs text-[#786C5E] hover:text-[#1C1917] px-2 py-1 rounded-md transition-colors"
              title="दुकान एडमिन पैनल"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A6B1F]" />
              <span>एडमिन</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#44403C] hover:bg-[#F2ECE4] rounded-lg transition-colors cursor-pointer"
              aria-label="मेनू खोलें"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8DFD5] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2">
          {/* Live Store status banner in mobile drawer */}
          <div className="mb-3 p-2.5 bg-white border border-[#E8DFD5] rounded-xl flex items-center justify-between">
            <StoreStatusBadge />
          </div>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'home' ? 'bg-[#EAE0D3] text-[#1C1917] font-semibold' : 'text-[#44403C] hover:bg-[#F2ECE4]'
              }`}
            >
              <span>होम (Home)</span>
            </button>

            <button
              onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'products' ? 'bg-[#EAE0D3] text-[#1C1917] font-semibold' : 'text-[#44403C] hover:bg-[#F2ECE4]'
              }`}
            >
              <span>सभी कपड़े (All Clothes)</span>
            </button>

            <div className="pt-2 pb-1 border-t border-[#E8DFD5] my-1">
              <span className="text-[11px] font-bold text-[#8C7A68] px-3 uppercase tracking-wider">
                श्रेणियां
              </span>
            </div>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { onNavigate('category', cat.id); setMobileMenuOpen(false); }}
                className="flex items-center justify-between text-left py-2 px-3 pl-6 rounded-lg text-sm text-[#44403C] hover:bg-[#F2ECE4]"
              >
                <span>{cat.name_hi}</span>
              </button>
            ))}

            <div className="pt-2 pb-1 border-t border-[#E8DFD5] my-1"></div>

            <button
              onClick={() => { onNavigate('offers'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium text-[#B91C1C] hover:bg-[#FEE2E2]"
            >
              <span className="font-semibold">खास ऑफर एवं छूट</span>
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => { onNavigate('wishlist'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium text-[#44403C] hover:bg-[#F2ECE4]"
            >
              <span>मेरी पसंद (Wishlist)</span>
              <span className="bg-[#EAE0D3] text-xs px-2 py-0.5 rounded-full tabular-nums">{wishlist.length}</span>
            </button>

            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium text-[#44403C] hover:bg-[#F2ECE4]"
            >
              <span>संपर्क व दुकान का पता</span>
              <MapPin className="w-4 h-4 text-[#786C5E]" />
            </button>

            {/* Quick Call Button in Mobile Menu */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="tel:+918529095431"
                className="py-2.5 px-3 bg-[#1C1917] text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#E2B158]" />
                <span>कॉल करें</span>
              </a>

              <a
                href="https://wa.me/918529095431"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#25D366] text-[#0A2914] rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-medium text-[#786C5E] hover:bg-[#EAE0D3] mt-2 border border-[#D5C7B8]"
            >
              <span>दुकानदार एडमिन लॉगिन</span>
              <UserCheck className="w-4 h-4 text-[#9A6B1F]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
