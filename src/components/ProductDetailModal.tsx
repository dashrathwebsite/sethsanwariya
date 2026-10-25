import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { WhatsAppPreviewModal } from './WhatsAppPreviewModal';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Phone, 
  Share2, 
  Check, 
  ShoppingBag, 
  Shield, 
  Truck, 
  RotateCcw,
  ImageOff,
  Copy,
  ExternalLink,
  Globe
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCart
}) => {
  const { 
    isInWishlist, 
    toggleWishlist, 
    addToCart, 
    generateWhatsAppLink, 
    generateProductWhatsAppMessage, 
    settings 
  } = useStore();

  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'मानक');
  const [selectedColor, setSelectedColor] = useState<{ name_hi: string; hex: string }>(
    product.colors[0] || { name_hi: 'मूल रंग', hex: '#666666' }
  );
  const [quantity, setQuantity] = useState(1);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [showShareOptions, setShowShareOptions] = useState(false);

  // WhatsApp Review Modal state
  const [isWhatsAppReviewOpen, setIsWhatsAppReviewOpen] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const allImages = product.images && product.images.length > 0 ? product.images : [product.main_image];

  // Deployed production URLs as specified in user request
  const netlifyUrl = `https://sethsanwariyacollection.netlify.app/#product=${product.id}`;
  const customDomainUrl = `https://sathsanwariya.com/#product=${product.id}`;
  
  // Detect current hostname
  const isProductionDomain = typeof window !== 'undefined' && (
    window.location.hostname === 'sethsanwariyacollection.netlify.app' ||
    window.location.hostname === 'sathsanwariya.com'
  );
  const primaryShareUrl = isProductionDomain 
    ? `${window.location.origin}/#product=${product.id}`
    : netlifyUrl;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2500);
  };

  const handleInitiateWhatsApp = () => {
    setIsWhatsAppReviewOpen(true);
  };

  const whatsAppMessage = generateProductWhatsAppMessage(
    product,
    selectedSize,
    selectedColor.name_hi,
    quantity,
    primaryShareUrl
  );
  const whatsAppLink = generateWhatsAppLink(whatsAppMessage);

  // Web Share API handler with Clipboard copy fallback
  const handleShare = async () => {
    const shareData = {
      title: `${product.name_hi} | ${settings.store_name_hi}`,
      text: `${product.name_hi} - कीमत ₹${product.price}। सेठ सांवरिया कलेक्शन पर देखें:`,
      url: primaryShareUrl,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setCopiedToast("सफलतापूर्वक शेयर किया गया!");
        setTimeout(() => setCopiedToast(null), 2500);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // User canceled native picker, do not force copy
          return;
        }
        // If native share failed for another reason, fallback to clipboard
        await copyToClipboard(primaryShareUrl, "लिंक क्लिपबोर्ड पर कॉपी हो गया!");
      }
    } else {
      // Web Share API not supported, copy to clipboard directly
      await copyToClipboard(primaryShareUrl, "लिंक क्लिपबोर्ड पर कॉपी हो गया!");
      setShowShareOptions(true);
    }
  };

  const copyToClipboard = async (url: string, msg = "कपड़े का लिंक कॉपी हो गया!") => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedToast(msg);
      setTimeout(() => setCopiedToast(null), 3000);
    } catch {
      setCopiedToast("लिंक कॉपी नहीं हो सका, कृपया मैन्युअल कॉपी करें।");
      setTimeout(() => setCopiedToast(null), 3000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
        <div 
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8DFD5] bg-[#FAF8F5] shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">कपड़े का विवरण</span>
              <span aria-hidden="true" className="text-[#D5C7B8]">·</span>
              <span className="text-xs text-[#786C5E] font-mono">कोड: {product.sku}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Top Share Icon */}
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 text-[#44403C] hover:text-[#9A6B1F] hover:bg-[#EAE0D3] rounded-full transition-colors"
                title="शेयर करें (Share Link)"
                aria-label="शेयर करें"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-[#44403C] hover:text-[#1C1917] hover:bg-[#EAE0D3] rounded-full transition-colors ml-1"
                aria-label="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* LEFT: Image Gallery */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-4/3 sm:aspect-1/1 w-full rounded-xl overflow-hidden bg-[#F5EFEB] border border-[#E8DFD5]">
                  {!imageErrors[activeImageIndex] && allImages[activeImageIndex] ? (
                    <img
                      src={allImages[activeImageIndex]}
                      alt={product.name_hi}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      onError={() => setImageErrors(prev => ({ ...prev, [activeImageIndex]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#8C7A68] bg-[#FAF8F5]">
                      <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-sm font-hindi">{product.name_hi}</span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-white text-[#44403C] rounded-full shadow-md transition-colors cursor-pointer"
                    aria-label="पसंद में जोड़ें"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#B91C1C] text-[#B91C1C]' : 'text-[#44403C]'}`} />
                  </button>

                  {/* Discount Badge */}
                  {product.discount_percent && product.discount_percent > 0 && (
                    <div className="absolute top-3 left-3 bg-[#B91C1C] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                      {product.discount_percent}% छूट
                    </div>
                  )}
                </div>

                {/* Thumbnails if multiple images */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx ? 'border-[#9A6B1F] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: Contiguous Purchase Module */}
              <div className="flex flex-col justify-between space-y-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-hindi text-[#1C1917] leading-tight">
                    {product.name_hi}
                  </h1>
                  {product.name_en && (
                    <p className="text-sm text-[#786C5E] mt-0.5">{product.name_en}</p>
                  )}

                  {/* Price Display */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1C1917] tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-base text-[#8C7A68] line-through tabular-nums">
                        ₹{product.original_price.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.discount_percent && product.discount_percent > 0 && (
                      <span className="text-sm text-[#B91C1C] font-semibold">
                        (बचत ₹{(product.original_price! - product.price).toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                    {product.stock_quantity > 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 font-hindi">
                        <Check className="w-3.5 h-3.5" />
                        उपलब्ध है ({product.stock_quantity} पीस शेष)
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-hindi">
                        वर्तमान में समाप्त (Out of Stock)
                      </span>
                    )}
                  </div>

                  {/* 1. Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold font-hindi text-[#1C1917]">
                          साइज चुनें:
                        </label>
                        <span className="text-xs text-[#9A6B1F] font-medium font-hindi">
                          चयनित: {selectedSize}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-h-[42px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                              selectedSize === size
                                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                                : 'bg-white text-[#44403C] border-[#D5C7B8] hover:border-[#1C1917]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold font-hindi text-[#1C1917]">
                          रंग चुनें:
                        </label>
                        <span className="text-xs text-[#9A6B1F] font-medium font-hindi">
                          {selectedColor.name_hi}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {product.colors.map((color) => {
                          const isSelected = selectedColor.name_hi === color.name_hi;
                          return (
                            <button
                              key={color.name_hi}
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#9A6B1F] bg-[#FAF8F5] ring-2 ring-[#9A6B1F]/30'
                                  : 'border-[#E8DFD5] bg-white hover:border-[#9A6B1F]'
                              }`}
                            >
                              <span 
                                className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{color.name_hi}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Quantity Stepper */}
                  <div className="mt-5 flex items-center gap-4">
                    <label className="text-sm font-semibold font-hindi text-[#1C1917]">
                      मात्रा:
                    </label>
                    <div className="flex items-center border border-[#D5C7B8] rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-base text-[#44403C] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                        aria-label="मात्रा कम करें"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-bold tabular-nums min-w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 text-base text-[#44403C] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                        aria-label="मात्रा बढ़ाएं"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6 pt-5 border-t border-[#E8DFD5]">
                    <h4 className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider mb-2 font-hindi">
                      कपड़े की खासियत व विवरण
                    </h4>
                    <p className="text-sm text-[#44403C] leading-relaxed font-hindi">
                      {product.description_hi}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-[#E8DFD5]">
                  {/* 1. Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF8F5] hover:bg-[#F2ECE4] border-2 border-[#1C1917] text-[#1C1917] rounded-xl font-bold font-hindi text-sm transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#9A6B1F]" />
                    <span>कार्ट में जोड़ें (Add to Cart)</span>
                  </button>

                  {/* 2. Direct WhatsApp Order */}
                  <button
                    type="button"
                    onClick={handleInitiateWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold font-hindi text-sm transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
                    <span>WhatsApp पर पूछें / ऑर्डर करें</span>
                  </button>

                  {/* Secondary Row: Call Store & Dedicated Share Button (Web Share API / Copy) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="tel:+918529095431"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F5EFEB] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg text-xs font-semibold font-hindi transition-colors text-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#9A6B1F]" />
                      <span>कॉल (+91 8529095431)</span>
                    </a>

                    {/* Dedicated Share Button */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F5EFEB] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg text-xs font-semibold font-hindi transition-colors cursor-pointer"
                      title="कपड़े का लिंक शेयर करें"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#9A6B1F]" />
                      <span>शेयर करें (Share Link)</span>
                    </button>
                  </div>

                  {/* Optional Deployed URLs panel toggle */}
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="text-[11px] text-[#8C7A68] hover:text-[#1C1917] underline font-hindi"
                    >
                      {showShareOptions ? "शेयर लिंक विकल्प छिपाएं" : "लाइव वेबसाइट शेयर लिंक विकल्प देखें"}
                    </button>
                  </div>

                  {/* Deployed URLs Box */}
                  {showShareOptions && (
                    <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl space-y-2 text-xs font-hindi animate-in fade-in">
                      <span className="font-bold text-[#1C1917] block">लाइव वेबसाइट शेयर लिंक:</span>
                      
                      {/* Netlify URL */}
                      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-[#E8DFD5]">
                        <div className="truncate flex-1">
                          <span className="text-[10px] text-[#8C7A68] block">Netlify URL:</span>
                          <span className="font-mono text-[11px] text-[#1C1917] truncate">{netlifyUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(netlifyUrl, "Netlify लिंक कॉपी हो गया!")}
                          className="px-2 py-1 bg-[#F5EFEB] hover:bg-[#EAE0D3] rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          <Copy className="w-3 h-3 text-[#9A6B1F]" />
                          <span>कॉपी</span>
                        </button>
                      </div>

                      {/* Custom Domain URL */}
                      <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-[#E8DFD5]">
                        <div className="truncate flex-1">
                          <span className="text-[10px] text-[#8C7A68] block">कस्टम डोमेन (sathsanwariya.com):</span>
                          <span className="font-mono text-[11px] text-[#1C1917] truncate">{customDomainUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(customDomainUrl, "Custom Domain लिंक कॉपी हो गया!")}
                          className="px-2 py-1 bg-[#F5EFEB] hover:bg-[#EAE0D3] rounded text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          <Copy className="w-3 h-3 text-[#9A6B1F]" />
                          <span>कॉपी</span>
                        </button>
                      </div>

                      {/* WhatsApp Direct Share */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${product.name_hi} - कीमत ₹${product.price}। सेठ सांवरिया कलेक्शन पर देखें: ${primaryShareUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-lg text-xs font-bold font-hindi flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#0A2914]" />
                        <span>सीधे WhatsApp पर शेयर करें</span>
                      </a>
                    </div>
                  )}

                  {/* Store Promises Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-[#786C5E] font-hindi text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="w-4 h-4 text-[#9A6B1F] mb-1" />
                      <span>100% प्रामाणिक</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Truck className="w-4 h-4 text-[#9A6B1F] mb-1" />
                      <span>सुरक्षित डिलीवरी</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <RotateCcw className="w-4 h-4 text-[#9A6B1F] mb-1" />
                      <span>7 दिन आसान बदलाव</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Added Toast Notification */}
          {addedToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold font-hindi flex items-center gap-2 z-20">
              <Check className="w-4 h-4 text-[#4ADE80]" />
              <span>कपड़ा आपके कार्ट में जोड़ दिया गया है!</span>
              <button 
                onClick={() => { onClose(); onOpenCart(); }} 
                className="text-[#E2B158] underline ml-2"
              >
                कार्ट देखें
              </button>
            </div>
          )}

          {/* Copied / Shared Toast Notification */}
          {copiedToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white px-5 py-2.5 rounded-xl shadow-xl text-xs font-bold font-hindi z-20 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#4ADE80]" />
              <span>{copiedToast}</span>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Message Review Modal */}
      <WhatsAppPreviewModal
        isOpen={isWhatsAppReviewOpen}
        onClose={() => setIsWhatsAppReviewOpen(false)}
        initialMessage={whatsAppMessage}
        whatsAppUrl={whatsAppLink}
      />
    </>
  );
};
