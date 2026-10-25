import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight, 
  Truck, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToProducts
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartCount, 
    cartSubtotal, 
    deliveryCharge, 
    cartTotal,
    generateWhatsAppLink,
    generateCartWhatsAppMessage,
    settings 
  } = useStore();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleWhatsAppOrderCart = () => {
    const text = generateCartWhatsAppMessage();
    const link = generateWhatsAppLink(text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const amountToFreeDelivery = Math.max(0, settings.delivery_charge_threshold - cartSubtotal);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFD5] bg-[#FAF8F5] shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#9A6B1F]" />
              <h2 className="text-base font-bold font-hindi text-[#1C1917]">
                शॉपिंग कार्ट ({cartCount} वस्तुएं)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#44403C] hover:text-[#1C1917] hover:bg-[#EAE0D3] rounded-full transition-colors"
              aria-label="कार्ट बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-[#FAF8F5] px-5 py-2.5 border-b border-[#E8DFD5] text-xs font-hindi">
              {amountToFreeDelivery > 0 ? (
                <div className="flex items-center justify-between text-[#786C5E]">
                  <span>मुफ्त डिलीवरी के लिए ₹{amountToFreeDelivery} का सामान और जोड़ें</span>
                  <Truck className="w-4 h-4 text-[#9A6B1F]" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Sparkles className="w-4 h-4 text-[#E2B158]" />
                  <span>बधाई! आपके ऑर्डर पर मुफ़्त डिलीवरी लागू है।</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8DFD5] flex items-center justify-center text-[#8C7A68]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-hindi text-[#1C1917]">
                    आपका कार्ट अभी खाली है
                  </h3>
                  <p className="text-xs text-[#786C5E] mt-1 font-hindi">
                    सेठ सांवरिया कलेक्शन के सुंदर कुर्ते, साड़ियां और सूट देखें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigateToProducts(); }}
                  className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#2E2824] text-white text-xs font-bold font-hindi rounded-lg transition-colors"
                >
                  कपड़े देखना शुरू करें
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`}
                  className="flex gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFD5] relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.main_image}
                    alt={item.product.name_hi}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-white border border-[#E8DFD5] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-semibold font-hindi text-[#1C1917] line-clamp-1">
                          {item.product.name_hi}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                          className="text-[#8C7A68] hover:text-[#B91C1C] p-1 transition-colors"
                          aria-label="हटाएं"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Size & Color */}
                      <div className="flex items-center gap-2 text-[11px] text-[#786C5E] mt-1 font-hindi">
                        <span>साइज़: <strong className="text-[#1C1917]">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          रंग: 
                          <span 
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-[#1C1917]">{item.selectedColor.name_hi}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Price and Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DFD5]/60">
                      <span className="text-sm font-bold text-[#1C1917] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-[#D5C7B8] rounded bg-white overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)}
                          className="px-2 py-0.5 text-[#44403C] hover:bg-[#F5EFEB]"
                          aria-label="कम करें"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)}
                          className="px-2 py-0.5 text-[#44403C] hover:bg-[#F5EFEB]"
                          aria-label="बढ़ाएं"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8DFD5] bg-[#FAF8F5] space-y-3 shrink-0">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs font-hindi">
                <div className="flex justify-between text-[#786C5E]">
                  <span>सामान का कुल मूल्य (Subtotal):</span>
                  <span className="tabular-nums font-semibold text-[#1C1917]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#786C5E]">
                  <span>डिलीवरी शुल्क (Shipping):</span>
                  <span className="tabular-nums font-semibold text-[#1C1917]">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700">मुफ़्त (Free)</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="border-t border-[#E8DFD5] pt-1.5 flex justify-between text-base font-bold text-[#1C1917]">
                  <span>कुल देय राशि (Total):</span>
                  <span className="text-[#9A6B1F] tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Direct WhatsApp Order Entire Cart */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrderCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold font-hindi text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span>WhatsApp पर पूरा कार्ट ऑर्डर करें</span>
                </button>

                {/* 2. Order Form (Inquiry / COD) */}
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#1C1917] text-[#1C1917] rounded-xl font-bold font-hindi text-xs transition-all"
                >
                  <span>पता दर्ज करके ऑर्डर कन्फर्म करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clear Cart Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-[#8C7A68] hover:text-[#B91C1C] underline font-hindi"
                >
                  पूरा कार्ट खाली करें
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <OrderCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderSuccess={() => {
          setCheckoutModalOpen(false);
          onClose();
        }}
      />
    </>
  );
};
