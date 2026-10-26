import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { WhatsAppPreviewModal } from './WhatsAppPreviewModal';
import { Heart, MessageCircle, ShoppingCart, ImageOff } from 'lucide-react';

import { resolveImageUrl } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { isInWishlist, toggleWishlist, addToCart, generateWhatsAppLink, generateProductWhatsAppMessage } = useStore();
  const [imageError, setImageError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isWhatsAppReviewOpen, setIsWhatsAppReviewOpen] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWhatsAppReviewOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'मानक';
    const defaultColor = product.colors[0] || { name_hi: 'मूल रंग', hex: '#666666' };
    addToCart(product, defaultSize, defaultColor, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const primarySize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'मानक';
  const primaryColor = product.colors && product.colors.length > 0 ? product.colors[0].name_hi : 'मूल रंग';
  const message = generateProductWhatsAppMessage(product, primarySize, primaryColor, 1, window.location.href);
  const link = generateWhatsAppLink(message);

  const resolvedImage = resolveImageUrl(product.main_image);

  return (
    <>
      <div 
        onClick={() => onSelect(product)}
        className="group relative flex flex-col bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
      >
        {/* 1. Image Container with Zero-Broken-Image Fallback */}
        <div className="relative aspect-4/3 sm:aspect-1/1 w-full bg-[#F5EFEB] overflow-hidden">
          {!imageError && resolvedImage ? (
            <img
              src={resolvedImage}
              alt={product.name_hi}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F5EFEB] to-[#EAE0D3] text-[#8C7A68]">
              <ImageOff className="w-8 h-8 mb-2 opacity-60" />
              <span className="text-xs font-hindi text-center font-medium line-clamp-1">{product.name_hi}</span>
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 hover:bg-white text-[#44403C] rounded-full shadow-xs transition-colors"
            aria-label={isFavorite ? "पसंद से हटाएं" : "पसंद में जोड़ें"}
            title={isFavorite ? "पसंद से हटाएं" : "पसंद में जोड़ें"}
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#B91C1C] text-[#B91C1C]' : 'text-[#44403C]'}`} />
          </button>

          {/* Discrete Promotional Text Tag */}
          {product.discount_percent && product.discount_percent > 0 ? (
            <div className="absolute top-2.5 left-2.5 bg-[#B91C1C] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
              {product.discount_percent}% छूट
            </div>
          ) : product.is_new_arrival ? (
            <div className="absolute top-2.5 left-2.5 bg-[#1C1917] text-[#E2B158] text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
              नया आगमन
            </div>
          ) : null}

          {/* Quick Added Indicator */}
          {addedToast && (
            <div className="absolute inset-0 bg-[#1C1917]/80 flex items-center justify-center text-white text-xs font-semibold font-hindi animate-in fade-in">
              ✓ कार्ट में जोड़ा गया!
            </div>
          )}
        </div>

        {/* 2. Content & Pricing Details */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            {/* Metadata: SKU & Sizes */}
            <div className="flex items-center gap-2 text-[11px] text-[#786C5E] mb-1 font-hindi">
              <span>कोड: {product.sku}</span>
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#B91C1C] font-semibold">मात्र {product.stock_quantity} बचे हैं</span>
                </>
              )}
            </div>

            {/* Hindi Product Name */}
            <h3 className="text-[15px] sm:text-base font-semibold font-hindi text-[#1C1917] line-clamp-2 leading-snug group-hover:text-[#9A6B1F] transition-colors">
              {product.name_hi}
            </h3>

            {/* Sizes preview if any */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1 overflow-hidden text-[11px] text-[#786C5E] font-hindi">
                <span className="shrink-0">साइज:</span>
                <span className="truncate">{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</span>
              </div>
            )}
          </div>

          {/* Price Row */}
          <div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg sm:text-xl font-bold text-[#1C1917] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-[#8C7A68] line-through tabular-nums">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Action Buttons: 2 large touch-friendly buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0E8DF]">
              {/* Quick Add to Cart */}
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#F5EFEB] hover:bg-[#EAE0D3] text-[#1C1917] rounded-lg text-xs font-semibold font-hindi transition-colors cursor-pointer"
                title="कार्ट में जोड़ें"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#9A6B1F]" />
                <span>कार्ट में जोड़ें</span>
              </button>

              {/* Direct WhatsApp with review modal */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg text-xs font-semibold font-hindi transition-colors shadow-2xs cursor-pointer"
                title="WhatsApp पर पूछें"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <WhatsAppPreviewModal
        isOpen={isWhatsAppReviewOpen}
        onClose={() => setIsWhatsAppReviewOpen(false)}
        initialMessage={message}
        whatsAppUrl={link}
      />
    </>
  );
};
