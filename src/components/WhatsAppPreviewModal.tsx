import React, { useState, useEffect } from 'react';
import { X, MessageCircle, AlertCircle, Edit3, Check } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage: string;
  whatsAppUrl: string;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  onClose,
  initialMessage,
  whatsAppUrl
}) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  if (!isOpen) return null;

  const handleSend = () => {
    // Generate clean WhatsApp link with the reviewed message
    const baseUrl = whatsAppUrl.split('?')[0];
    const encoded = encodeURIComponent(message);
    const finalLink = `${baseUrl}?text=${encoded}`;
    window.open(finalLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-5 sm:p-6 my-auto space-y-4 animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#20BA5A]" />
            </div>
            <div>
              <h3 className="font-bold font-hindi text-base text-[#1C1917]">
                WhatsApp संदेश की समीक्षा (Review Message)
              </h3>
              <p className="text-[11px] text-[#786C5E] font-hindi">
                भेजने से पहले आप अपना संदेश देख सकते हैं
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#44403C] hover:text-[#1C1917] hover:bg-[#FAF8F5] rounded-full"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message preview & editable textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold font-hindi text-[#1C1917]">
            दुकानदार (+91 8529095431) को भेजा जाने वाला संदेश:
          </label>
          <div className="bg-[#FAF8F5] border border-[#D5C7B8] rounded-xl p-3">
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-hindi text-[#1C1917] leading-relaxed focus:outline-none resize-none"
            />
          </div>
          <span className="block text-[11px] text-[#8C7A68] font-hindi">
            💡 आप चाहें तो संदेश में कोई विशेष निर्देश या पता भी लिख सकते हैं।
          </span>
        </div>

        {/* Disclaimer / Transparency note (Mandatory per Section 6) */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-hindi text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>कृपया ध्यान दें:</strong> केवल WhatsApp खुलने से ऑर्डर कन्फर्म नहीं होता है। अंतिम उपलब्धता, डिलीवरी का समय और बिल की पुष्टि दुकानदार से चैट द्वारा की जाएगी।
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#D5C7B8] hover:bg-[#FAF8F5] text-[#44403C] rounded-xl text-xs font-semibold font-hindi transition-colors"
          >
            रद्द करें
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-xl text-xs sm:text-sm font-bold font-hindi flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#0A2914]" />
            <span>WhatsApp पर भेजें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
