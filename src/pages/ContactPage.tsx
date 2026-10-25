import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreStatusBadge } from '../components/StoreStatusBadge';
import { WhatsAppPreviewModal } from '../components/WhatsAppPreviewModal';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, generateWhatsAppLink } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const handleWhatsAppContact = () => {
    const text = `नमस्ते सेठ सांवरिया कलेक्शन! 🙏\n\nमुझे दुकान और कपड़ों के कलेक्शन के बारे में जानकारी चाहिए।`;
    setReviewMessage(text);
    setIsReviewModalOpen(true);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    const formatted = `नमस्ते सेठ सांवरिया कलेक्शन! 🙏\n\nग्राहक का नाम: ${name}\nफ़ोन नंबर: ${phone}\nसंदेश: ${message}`;
    setReviewMessage(formatted);
    setIsReviewModalOpen(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-1">
            <StoreStatusBadge />
          </div>
          <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
            हमसे संपर्क करें
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-hindi text-[#1C1917]">
            संपर्क विवरण एवं दुकान का पता
          </h1>
          <p className="text-sm text-[#786C5E] font-hindi max-w-lg mx-auto">
            कपड़ों की उपलब्धता, साइज परामर्श या किसी भी प्रश्न के लिए सीधे संपर्क करें।
          </p>
        </div>

        {/* 3 Prominent Quick Action Buttons (Section 4.E of prompt) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. अभी कॉल करें */}
          <a
            href="tel:+918529095431"
            className="flex items-center justify-center gap-2.5 py-4 px-5 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold font-hindi text-sm shadow-md transition-all text-center"
          >
            <Phone className="w-5 h-5 text-[#E2B158]" />
            <span>अभी कॉल करें</span>
          </a>

          {/* 2. WhatsApp पर संपर्क करें */}
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="flex items-center justify-center gap-2.5 py-4 px-5 bg-[#25D366] hover:bg-[#20BA5A] text-[#0A2914] rounded-xl font-bold font-hindi text-sm shadow-md transition-all text-center cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-[#0A2914]" />
            <span>WhatsApp पर संपर्क करें</span>
          </button>

          {/* 3. दुकान का रास्ता देखें */}
          <a
            href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 py-4 px-5 bg-[#FAF8F5] hover:bg-[#F2ECE4] border-2 border-[#1C1917] text-[#1C1917] rounded-xl font-bold font-hindi text-sm shadow-xs transition-all text-center"
          >
            <MapPin className="w-5 h-5 text-[#9A6B1F]" />
            <span>दुकान का रास्ता देखें</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Details & Timings */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Opening Hours Box (Exact Section 5 requirement) */}
            <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-xs space-y-3 font-hindi">
              <div className="flex items-center gap-2 text-[#9A6B1F]">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-sm text-[#1C1917]">दुकान खुलने का समय</h3>
              </div>
              <p className="text-sm font-semibold text-[#1C1917] leading-relaxed">
                सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक
              </p>
              <p className="text-emerald-700 font-bold text-xs">
                सप्ताह के सभी 7 दिन खुली रहती है।
              </p>
              <div className="pt-1">
                <StoreStatusBadge compact />
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-xs space-y-3 text-xs font-hindi">
              <h3 className="font-bold text-sm text-[#1C1917]">सीधे संपर्क सूत्र</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#9A6B1F]" />
                    <span>फ़ोन नंबर:</span>
                  </div>
                  <a href="tel:+918529095431" className="font-bold text-[#1C1917] hover:underline">
                    +91 8529095431
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp नंबर:</span>
                  </div>
                  <a href="https://wa.me/918529095431" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1C1917] hover:underline">
                    +91 8529095431
                  </a>
                </div>
              </div>
            </div>

            {/* Location & Google Maps */}
            <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-xs space-y-3 text-xs font-hindi">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9A6B1F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C1917] text-sm block mb-1">दुकान का भौतिक पता</strong>
                  <p className="text-[#57534E] leading-relaxed">{settings.address_hi}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DFD5]">
                <a
                  href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E2B158]" />
                  <span>Google Maps पर लोकेशन खोलें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Official Social Media Channels (Section 1 of prompt) */}
            <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5 shadow-xs space-y-3 text-xs font-hindi">
              <h3 className="font-bold text-sm text-[#1C1917]">सोशल मीडिया पर फॉलो करें</h3>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://www.instagram.com/seth_sanwariya_collection_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E8DFD5] text-center space-y-1 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-[#E1306C]" />
                  <span className="font-semibold text-[11px] text-[#1C1917]">Instagram</span>
                </a>

                <a
                  href="https://www.facebook.com/p/Seth-Sanwariya-61584605940951/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E8DFD5] text-center space-y-1 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <span className="font-semibold text-[11px] text-[#1C1917]">Facebook</span>
                </a>

                <a
                  href="https://www.youtube.com/@seth_sanwariya_collection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#E8DFD5] text-center space-y-1 transition-colors"
                >
                  <Youtube className="w-5 h-5 text-[#FF0000]" />
                  <span className="font-semibold text-[11px] text-[#1C1917]">YouTube</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold font-hindi text-[#1C1917] mb-1">
              ऑनलाइन संदेश भेजें (Send Inquiry)
            </h3>
            <p className="text-xs text-[#786C5E] font-hindi mb-6">
              अपना विवरण लिखें। आप भेजने से पहले WhatsApp संदेश की समीक्षा कर सकेंगे।
            </p>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs font-hindi">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  आपका नाम *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. राजेश कुमार"
                  className="w-full px-3.5 py-2.5 border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  फ़ोन / मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full px-3.5 py-2.5 border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">
                  संदेश या कपड़ों से संबंधित प्रश्न *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="उदा. मुझे शादी के कुर्ते और बनारसी साड़ियों के नए रंगों के बारे में पूछना है..."
                  className="w-full px-3.5 py-2.5 border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold text-sm font-hindi transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E2B158]" />
                <span>संदेश तैयार करें व WhatsApp पर भेजें</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Review Modal */}
      <WhatsAppPreviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        initialMessage={reviewMessage}
        whatsAppUrl={generateWhatsAppLink(reviewMessage)}
      />
    </>
  );
};
