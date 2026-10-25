import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { settings } = useStore();
  const [activeTab, setActiveTab] = useState<'shipping' | 'return' | 'cancellation' | 'privacy'>('shipping');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
          नियम व शर्तें
        </span>
        <h1 className="text-3xl font-bold font-hindi text-[#1C1917]">
          दुकान की नीतियां (Store Policies)
        </h1>
        <p className="text-xs sm:text-sm text-[#786C5E] font-hindi">
          ग्राहकों के विश्वास और पूर्ण पारदर्शिता के लिए हमारे सरल नियम
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap border-b border-[#E8DFD5] pb-4">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold font-hindi transition-colors ${
            activeTab === 'shipping'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#E2B158]" />
          <span>डिलीवरी नीति (Shipping)</span>
        </button>

        <button
          onClick={() => setActiveTab('return')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold font-hindi transition-colors ${
            activeTab === 'return'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-[#E2B158]" />
          <span>वापसी व बदलाव (Returns)</span>
        </button>

        <button
          onClick={() => setActiveTab('cancellation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold font-hindi transition-colors ${
            activeTab === 'cancellation'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#E2B158]" />
          <span>ऑर्डर रद्दीकरण (Cancellation)</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold font-hindi transition-colors ${
            activeTab === 'privacy'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#57534E] border border-[#E8DFD5] hover:border-[#1C1917]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#E2B158]" />
          <span>गोपनीयता नीति (Privacy)</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs text-sm text-[#44403C] font-hindi leading-relaxed space-y-4">
        {activeTab === 'shipping' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C1917] mb-3">
              डिलीवरी एवं शिपिंग नियम (Shipping Policy)
            </h2>
            <p className="mb-4">{settings.shipping_policy_hi}</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#57534E]">
              <li>₹{settings.delivery_charge_threshold} या उससे अधिक के सभी ऑर्डर पर डिलीवरी पूर्णतः निःशुल्क है।</li>
              <li>₹{settings.delivery_charge_threshold} से कम के ऑर्डर पर नाममात्र ₹{settings.standard_delivery_charge} का मानक शिपिंग चार्ज लागू होता है।</li>
              <li>पार्सल निकलने के बाद आपको WhatsApp पर ट्रैकिंग नंबर एवं डिलीवरी पार्टनर की जानकारी दे दी जाती है।</li>
              <li>यदि किसी प्राकृतिक आपदा या अवकाश के कारण विलंब होता है, तो हमारी टीम आपसे संपर्क करेगी।</li>
            </ul>
          </div>
        )}

        {activeTab === 'return' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C1917] mb-3">
              वापसी एवं बदलाव नीति (Return & Exchange Policy)
            </h2>
            <p className="mb-4">{settings.return_policy_hi}</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#57534E]">
              <li>यदि कपड़े का साइज़ फिट नहीं आता है, तो आप डिलीवरी के 7 दिनों के भीतर साइज बदलवा सकते हैं।</li>
              <li>कपड़ा बिना धुला हुआ, अप्रयुक्त और मूल टैग व रसीद के साथ होना अनिवार्य है।</li>
              <li>एक्सचेंज अनुरोध के लिए हमारे WhatsApp नंबर पर पार्सल और कपड़े की फोटो भेजें।</li>
            </ul>
          </div>
        )}

        {activeTab === 'cancellation' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C1917] mb-3">
              ऑर्डर रद्दीकरण नीति (Cancellation Policy)
            </h2>
            <p className="mb-4">{settings.cancellation_policy_hi}</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#57534E]">
              <li>जब तक ऑर्डर दुकान से डिस्पैच नहीं हुआ है, आप बिना किसी शुल्क के कभी भी ऑर्डर निरस्त कर सकते हैं।</li>
              <li>ऑर्डर रद्द करने के लिए सीधे हमारे WhatsApp या सहायता नंबर पर ऑर्डर आईडी भेजें।</li>
            </ul>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C1917] mb-3">
              ग्राहक डेटा गोपनीयता नीति (Privacy Policy)
            </h2>
            <p className="mb-4">
              सेठ सांवरिया कलेक्शन आपके व्यक्तिगत विवरण (नाम, फ़ोन नंबर, डिलीवरी पता) की गोपनीयता का पूरा सम्मान करता है।
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#57534E]">
              <li>आपकी जानकारी का उपयोग केवल आपके ऑर्डर की डिलीवरी और WhatsApp पर अपडेट देने हेतु किया जाता है।</li>
              <li>हम आपके संपर्क विवरण किसी भी तीसरे पक्ष (Third Party) या विज्ञापन कंपनी के साथ साझा नहीं करते।</li>
              <li>वेबसाइट पर कुकीज का उपयोग केवल आपके शॉपिंग कार्ट और पसंदीदा कपड़ों को सुरक्षित रखने के लिए किया जाता है।</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};
