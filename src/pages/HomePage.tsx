import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { StoreStatusBadge } from '../components/StoreStatusBadge';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';
import { Product } from '../types';
import { resolveImageUrl } from '../utils/imageUtils';
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, categoryId?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { products, categories, banners, settings, generateWhatsAppLink } = useStore();
  const [isGeneralWhatsAppOpen, setIsGeneralWhatsAppOpen] = useState(false);

  const activeBanners = banners.filter(b => b.is_active);
  const mainBanner = activeBanners[0];

  const featuredProducts = products.filter(p => p.is_active && p.is_featured);
  const newArrivals = products.filter(p => p.is_active && p.is_new_arrival);

  const generalInquiryMsg = `नमस्ते सेठ सांवरिया कलेक्शन! 🙏\n\nमुझे आपके नए कपड़ों के कलेक्शन के बारे में जानकारी चाहिए।\nकृपया उपलब्ध कैटलॉग साझा करें।`;
  const generalWhatsAppUrl = generateWhatsAppLink(generalInquiryMsg);

  const logoUrl = settings.logo_url || "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";
  const heroImageUrl = resolveImageUrl(mainBanner?.image_url) || "/images/hero_festive_ethnic_1792914844440.jpg";

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 0. GRAND 3D CENTER LOGO & ROYAL STORE SHOWCASE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F0C09] via-[#1A130D] to-[#120D08] text-white pt-8 pb-10 px-4 border-b border-[#D4AF37]/30 shadow-2xl">
        {/* Subtle Ambient Radial Illumination */}
        <div className="absolute inset-0 bg-radial from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 space-y-4">
          
          {/* Big 3D Circular Logo with Concentric Metallic Gold Rings */}
          <div className="relative group">
            {/* Ambient Gold Radial Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3C4] to-[#B45309] opacity-45 blur-2xl animate-pulse pointer-events-none" />
            
            {/* Outer 3D Gold Beveled Ring */}
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-b from-[#FFF5DA] via-[#D4AF37] to-[#4A3222] shadow-[0_14px_45px_rgba(212,175,55,0.45),inset_0_2px_8px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border-2 border-[#E2B158]/70 shadow-inner">
                <img
                  src={logoUrl}
                  alt="SETH SANWARIYA COLLECTION"
                  className="w-full h-full object-contain rounded-full p-1 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3D Gold Typography */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B158] to-[#996D1E] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] uppercase leading-tight">
              SETH SANWARIYA
              <span className="block text-xl sm:text-3xl tracking-[0.22em] font-light text-[#E5C178] mt-1">
                COLLECTION
              </span>
            </h1>
            <p className="text-base sm:text-xl font-hindi font-bold text-[#F3E8D8] tracking-wide pt-1">
              सेठ सांवरिया कलेक्शन
            </p>
            <p className="text-xs sm:text-sm font-hindi text-[#D4AF37] font-semibold">
              कातर छोटी, राजस्थान – 331517 (Katar Chhoti, Rajasthan)
            </p>
          </div>

          {/* Live Store Timings Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <StoreStatusBadge />
            <span className="text-xs text-[#D5C2AF] font-hindi bg-[#241A12] px-3 py-1 rounded-full border border-[#D4AF37]/30">
              सुबह 8:00 AM से रात 10:00 PM · सातों दिन खुली है
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="px-6 py-3 bg-gradient-to-r from-[#E2B158] to-[#D49E24] hover:from-[#F3D082] hover:to-[#E2B158] text-[#1C1917] rounded-xl font-bold font-hindi text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>कलेक्शन देखें (Browse)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsGeneralWhatsAppOpen(true)}
              className="px-5 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-xl font-bold font-hindi text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#0A2914]" />
              <span>WhatsApp पर ऑर्डर करें</span>
            </button>

            <a
              href="tel:+918529095431"
              className="px-4 py-3 bg-[#241B13] hover:bg-[#34271B] text-[#E2B158] border border-[#D4AF37]/40 rounded-xl font-bold font-hindi text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>+91 8529095431</span>
            </a>
          </div>

        </div>
      </section>

      {/* 1. HERO CAMPAIGN BANNER */}
      <section className="relative overflow-hidden bg-[#1C1917] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] lg:min-h-[500px] items-stretch">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-center p-6 sm:p-10 lg:p-14 z-10 space-y-5">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#E2B158] font-bold font-hindi bg-[#2E2824] px-3 py-1 rounded-full border border-[#443B33]">
                  ✨ नया उत्सव स्टॉक
                </span>
                <span className="text-xs text-[#D5C2AF] font-hindi">
                  कातर छोटी, राजस्थान
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-hindi leading-tight tracking-tight text-white max-w-xl">
                {mainBanner?.title_hi || "शाही विरासत एवं उत्सव कलेक्शन"}
              </h2>

              <p className="text-sm sm:text-base text-[#D5C2AF] font-hindi leading-relaxed max-w-lg">
                {mainBanner?.subtitle_hi || "विवाह, त्योहार और विशेष अवसरों के लिए प्रामाणिक शेरवानी, कुर्ते व सिल्क साड़ियों की नई श्रृंखला।"}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3.5 bg-[#E2B158] hover:bg-[#D49E24] text-[#1C1917] rounded-xl font-bold font-hindi text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>कलेक्शन देखें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsGeneralWhatsAppOpen(true)}
                  className="px-5 py-3.5 bg-[#2E2824] hover:bg-[#3D352F] text-white rounded-xl font-semibold font-hindi text-sm border border-[#524840] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                  <span>WhatsApp पर ऑर्डर करें</span>
                </button>
              </div>

              {/* Direct call banner & trust indicator */}
              <div className="pt-3 border-t border-[#38312B] flex flex-wrap items-center gap-6 text-xs text-[#A8A29E] font-hindi">
                <a 
                  href="tel:+918529095431" 
                  className="flex items-center gap-1.5 text-white hover:text-[#E2B158] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E2B158]" />
                  <span>सीधा कॉल: +91 8529095431</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E2B158]" />
                  <span>100% प्रामाणिक फैब्रिक</span>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full bg-[#2E2824]">
              <img
                src={heroImageUrl}
                alt="सेठ सांवरिया कलेक्शन"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-transparent lg:hidden" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
              कपड़ों की श्रेणियां
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917] mt-1">
              आप क्या देखना पसंद करेंगे?
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-semibold font-hindi text-[#9A6B1F] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>सभी श्रेणियां देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.filter(c => c.is_active).map((cat) => {
            const count = products.filter(p => p.category_id === cat.id && p.is_active).length;
            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                count={count}
                onClick={() => onNavigate('category', cat.id)}
              />
            );
          })}
        </div>
      </section>

      {/* 3. POPULAR / FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
                दुकानदार की विशेष पसंद
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917] mt-1">
                लोकप्रिय व चुनिंदा परिधान
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs sm:text-sm font-semibold font-hindi text-[#9A6B1F] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>सभी कपड़े देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. WHATSAPP DIRECT ORDERING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1C1917] to-[#2E2824] text-white rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-[#3E352C]">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4ADE80] bg-[#163820] px-3 py-1 rounded-full">
              <MessageCircle className="w-4 h-4" />
              <span>सीधा WhatsApp संपर्क (+91 8529095431)</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-hindi leading-snug">
              कपड़ा पसंद करें और सीधे WhatsApp पर ऑर्डर करें!
            </h3>

            <p className="text-sm text-[#D5C2AF] font-hindi leading-relaxed">
              आपको कोई कठिन ऑनलाइन फॉर्म भरने की आवश्यकता नहीं है। अपना मनपसंद कपड़ा, साइज और रंग चुनें और सीधे हमारे WhatsApp पर फोटो व विवरण भेजें।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsGeneralWhatsAppOpen(true)}
                className="px-5 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-xl font-bold font-hindi text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-[#0A2914]" />
                <span>अभी WhatsApp पर बात करें</span>
              </button>

              <a
                href="tel:+918529095431"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold font-hindi text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#E2B158]" />
                <span>फोन करें: +91 8529095431</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
                नया स्टॉक
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917] mt-1">
                नए कपड़े (Latest Products)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs sm:text-sm font-semibold font-hindi text-[#9A6B1F] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>पूरा नया कलेक्शन</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. STORE LOCATION, OFFICIAL OPENING HOURS & SOCIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E8DFD5] p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
                दुकान पर पधारें
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-hindi text-[#1C1917]">
                {settings.store_name_hi} के शो-रूम में आपका स्वागत है
              </h3>
              <p className="text-sm text-[#57534E] font-hindi leading-relaxed">
                कपड़े को प्रत्यक्ष रूप से देखकर, फैब्रिक की शुद्धता जांचकर और ट्रायल करके संतुष्टि के साथ खरीदें।
              </p>

              {/* Exact required wording */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DFD5] space-y-2 font-hindi">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9A6B1F]" />
                    <strong className="text-sm text-[#1C1917]">दुकान खुलने का समय</strong>
                  </div>
                  <StoreStatusBadge compact />
                </div>
                <p className="text-xs sm:text-sm text-[#1C1917] font-semibold">
                  सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक
                </p>
                <p className="text-emerald-700 text-xs font-bold">
                  सप्ताह के सभी 7 दिन खुली रहती है।
                </p>
              </div>

              {/* Address and Phone */}
              <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-hindi">
                <div className="flex items-start gap-2.5 text-[#57534E]">
                  <Phone className="w-4 h-4 text-[#9A6B1F]" />
                  <div>
                    <strong className="text-[#1C1917]">फ़ोन व WhatsApp: </strong>
                    <a href="tel:+918529095431" className="hover:underline font-semibold text-[#1C1917]">
                      +91 8529095431
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[#57534E]">
                  <MapPin className="w-4 h-4 text-[#9A6B1F]" />
                  <div>
                    <strong className="text-[#1C1917]">दुकान का पता: </strong>
                    <span>{settings.address_hi}</span>
                  </div>
                </div>
              </div>

              {/* Direct Location Button to Official Google Maps */}
              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl text-xs sm:text-sm font-bold font-hindi transition-colors flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-[#E2B158]" />
                  <span>दुकान का रास्ता देखें (Google Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-3 bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#D5C7B8] text-[#1C1917] rounded-xl text-xs sm:text-sm font-bold font-hindi transition-colors cursor-pointer"
                >
                  सभी संपर्क विकल्प
                </button>
              </div>
            </div>

            {/* Right Promo Box with 3D Circular Logo and Socials */}
            <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8DFD5] text-center space-y-4">
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-b from-[#FFF5DA] via-[#E2B158] to-[#4A3222] shadow-[0_4px_16px_rgba(226,177,88,0.3)] flex items-center justify-center mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/50">
                  <img
                    src={logoUrl}
                    alt="SETH SANWARIYA COLLECTION"
                    className="w-full h-full object-contain rounded-full p-1"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-base text-[#1C1917] font-hindi">
                  पारिवारिक खरीददारी का विश्वसनीय केंद्र
                </h4>
                <p className="text-xs text-[#786C5E] mt-1 font-hindi leading-relaxed">
                  कुर्ते, साड़ियां, शेरवानी, लहंगा और बच्चों के परिधानों का संपूर्ण संगम।
                </p>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-[#E8DFD5]">
                <span className="text-[11px] font-bold text-[#786C5E] block mb-2 font-hindi">
                  आधिकारिक सोशल मीडिया चैनल
                </span>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://www.instagram.com/seth_sanwariya_collection_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white border border-[#D5C7B8] hover:bg-[#E1306C] hover:text-white text-[#1C1917] transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/p/Seth-Sanwariya-61584605940951/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white border border-[#D5C7B8] hover:bg-[#1877F2] hover:text-white text-[#1C1917] transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@seth_sanwariya_collection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white border border-[#D5C7B8] hover:bg-[#FF0000] hover:text-white text-[#1C1917] transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <a
                  href="tel:+918529095431"
                  className="w-full py-2.5 bg-white border border-[#D5C7B8] text-[#1C1917] rounded-lg font-bold font-hindi text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#9A6B1F]" />
                  <span>कॉल करें (+91 8529095431)</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* General Inquiry Review Modal */}
      <WhatsAppPreviewModal
        isOpen={isGeneralWhatsAppOpen}
        onClose={() => setIsGeneralWhatsAppOpen(false)}
        initialMessage={generalInquiryMsg}
        whatsAppUrl={generalWhatsAppUrl}
      />

    </div>
  );
};
