import React from 'react';
import { useStore } from '../context/StoreContext';
import { StoreStatusBadge } from './StoreStatusBadge';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Lock,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, categoryId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories, generateWhatsAppLink } = useStore();

  const handleWhatsAppClick = () => {
    const link = generateWhatsAppLink("नमस्ते सेठ सांवरिया कलेक्शन! मुझे आपके स्टोर और कपड़ों के बारे में जानकारी चाहिए।");
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#1C1917] text-[#EDE4DA] pt-12 pb-8 border-t border-[#332E29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-[#332E29] text-xs font-hindi">
          <div className="flex flex-col items-center text-center p-3">
            <span className="w-10 h-10 rounded-full bg-[#2E2824] flex items-center justify-center text-[#E2B158] mb-2.5 text-base">
              ✨
            </span>
            <span className="font-bold text-white text-sm mb-0.5">100% प्रामाणिक फैब्रिक</span>
            <span className="text-[#A8A29E]">उच्च गुणवत्ता वाले शुद्ध धागे व बेहतरीन सिलाई</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <span className="w-10 h-10 rounded-full bg-[#2E2824] flex items-center justify-center text-[#E2B158] mb-2.5 text-base">
              📦
            </span>
            <span className="font-bold text-white text-sm mb-0.5">सुरक्षित पैकेजिंग</span>
            <span className="text-[#A8A29E]">हर परिधान को अत्यंत सावधानी से पैक करके भेजा जाता है</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <span className="w-10 h-10 rounded-full bg-[#2E2824] flex items-center justify-center text-[#E2B158] mb-2.5 text-base">
              💬
            </span>
            <span className="font-bold text-white text-sm mb-0.5">सीधा WhatsApp सपोर्ट</span>
            <span className="text-[#A8A29E]">दुकानदार से सीधे बातचीत करें और साइज कन्फर्म करें</span>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <span className="w-10 h-10 rounded-full bg-[#2E2824] flex items-center justify-center text-[#E2B158] mb-2.5 text-base">
              🔄
            </span>
            <span className="font-bold text-white text-sm mb-0.5">7 दिन आसान बदलाव</span>
            <span className="text-[#A8A29E]">साइज न मिलने पर बिना झंझट आसान एक्सचेंज सुविधा</span>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          
          {/* Col 1: Brand Info & Social Links */}
          <div className="space-y-3">
            <h3 className="font-heading text-xl font-bold tracking-wider text-white">
              {settings.store_name}
            </h3>
            <p className="text-sm font-hindi text-[#E2B158] font-medium">
              {settings.store_name_hi}
            </p>
            <p className="text-xs text-[#A8A29E] leading-relaxed font-hindi">
              {settings.tagline_hi}। भारतीय संस्कृति, उत्सव व आधुनिक फैशन का विश्वसनीय प्रतिष्ठान।
            </p>
            
            {/* Direct Official Communication Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href="https://wa.me/918529095431"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#2E2824] hover:bg-[#3D352F] text-white px-3 py-2 rounded-lg text-xs font-semibold font-hindi transition-colors border border-[#443C35]"
              >
                <MessageCircle className="w-4 h-4 text-[#4ADE80]" />
                <span>WhatsApp चैट</span>
              </a>

              <a
                href="tel:+918529095431"
                className="inline-flex items-center gap-1.5 bg-[#2E2824] hover:bg-[#3D352F] text-white px-3 py-2 rounded-lg text-xs font-semibold font-hindi transition-colors border border-[#443C35]"
              >
                <Phone className="w-4 h-4 text-[#E2B158]" />
                <span>कॉल करें</span>
              </a>
            </div>

            {/* Official Social Links (Section 1 of prompt) */}
            <div className="pt-3">
              <span className="text-[11px] font-bold text-[#A8A29E] block mb-2 font-hindi uppercase tracking-wider">
                सोशल मीडिया पर जुड़ें
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/seth_sanwariya_collection_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2E2824] hover:bg-[#E1306C] text-[#E2B158] hover:text-white flex items-center justify-center transition-colors border border-[#443C35]"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://www.facebook.com/p/Seth-Sanwariya-61584605940951/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2E2824] hover:bg-[#1877F2] text-[#E2B158] hover:text-white flex items-center justify-center transition-colors border border-[#443C35]"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="https://www.youtube.com/@seth_sanwariya_collection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#2E2824] hover:bg-[#FF0000] text-[#E2B158] hover:text-white flex items-center justify-center transition-colors border border-[#443C35]"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E2B158] mb-4">
              कपड़ों की श्रेणियां
            </h4>
            <ul className="space-y-2 text-xs font-hindi text-[#A8A29E]">
              <li>
                <button 
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors"
                >
                  सभी कपड़े (All Clothes)
                </button>
              </li>
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.id)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name_hi}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-[#E2B158] transition-colors font-semibold"
                >
                  खास ऑफर व छूट
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Links & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E2B158] mb-4">
              महत्वपूर्ण लिंक व नीतियां
            </h4>
            <ul className="space-y-2 text-xs font-hindi text-[#A8A29E]">
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  दुकान के बारे में (About Us)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  संपर्क व दुकान का पता
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('policies')}
                  className="hover:text-white transition-colors"
                >
                  डिलीवरी व वापसी नीति
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('policies')}
                  className="hover:text-white transition-colors"
                >
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#E2B158] flex items-center gap-1.5 transition-colors pt-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>दुकानदार लॉगिन (Admin Panel)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Exact Opening Hours (Section 5) */}
          <div className="space-y-3.5 text-xs font-hindi">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E2B158] mb-2">
              दुकान खुलने का समय व पता
            </h4>
            
            {/* Live Status indicator */}
            <div className="pb-1">
              <StoreStatusBadge />
            </div>

            {/* Exact Required Wording from Section 5 */}
            <div className="bg-[#2E2824] p-3 rounded-xl border border-[#443C35] space-y-1">
              <strong className="text-white text-xs block">दुकान खुलने का समय:</strong>
              <p className="text-[#E2B158] font-medium">
                सोमवार से रविवार — सुबह 8:00 बजे से रात 10:00 बजे तक
              </p>
              <p className="text-emerald-400 font-bold text-[11px]">
                सप्ताह के सभी 7 दिन खुली रहती है।
              </p>
            </div>

            {/* Official Contact Info */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[#A8A29E]">
                <Phone className="w-3.5 h-3.5 text-[#E2B158] shrink-0" />
                <a href="tel:+918529095431" className="hover:underline text-white font-semibold">
                  +91 8529095431
                </a>
              </div>

              <div className="flex items-center gap-2 text-[#A8A29E]">
                <MessageCircle className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                <a href="https://wa.me/918529095431" target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                  +91 8529095431 (WhatsApp)
                </a>
              </div>
            </div>

            {/* Official Google Maps Location Link */}
            <div className="pt-1">
              <a
                href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#E2B158] hover:underline font-semibold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>गूगल मैप पर दुकान का रास्ता देखें</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line: Copyright */}
        <div className="pt-8 border-t border-[#332E29] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786C5E] font-hindi">
          <div>
            © {new Date().getFullYear()} {settings.store_name}. सर्वाधिकार सुरक्षित।
          </div>
          <div className="flex items-center gap-3">
            <span>सप्ताह के सातों दिन आपकी सेवा में समर्पित</span>
            <span aria-hidden="true">·</span>
            <span>Made with Care for Indian Fashion</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
