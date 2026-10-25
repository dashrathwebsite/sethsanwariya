import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Sparkles, Heart, Award, MapPin } from 'lucide-react';

interface AboutPageProps {
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToContact }) => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider font-hindi">
          हमारी कहानी व विरासत
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-hindi text-[#1C1917]">
          {settings.store_name_hi} के बारे में
        </h1>
        <p className="text-sm sm:text-base text-[#786C5E] font-hindi max-w-xl mx-auto leading-relaxed">
          {settings.tagline_hi}
        </p>
      </div>

      {/* Main Story Box */}
      <div className="bg-white rounded-2xl border border-[#E8DFD5] p-6 sm:p-10 space-y-6 shadow-xs text-sm sm:text-base text-[#44403C] font-hindi leading-relaxed">
        <p>
          {settings.about_text_hi}
        </p>
        <p>
          हमारा उद्देश्य प्रत्येक ग्राहक को ऐसा पहनावा उपलब्ध कराना है जो न केवल दिखने में राजसी और सुरुचिपूर्ण हो, बल्कि पहनने में भी पूर्ण रूप से आरामदायक हो। हम कारीगरों के हाथों से बनी बारीक जरी, गोटा पट्टी, जरदोजी और शुद्ध सूती व रेशमी कपड़ों को सीधे आपके लिए संजोते हैं।
        </p>

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8DFD5]">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-center space-y-2">
            <Award className="w-6 h-6 text-[#9A6B1F] mx-auto" />
            <h3 className="font-bold text-[#1C1917] text-sm">सर्वोत्तम गुणवत्ता</h3>
            <p className="text-xs text-[#786C5E]">कच्चे माल से लेकर अंतिम सिलाई तक सख्त गुणवत्ता परीक्षण।</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-center space-y-2">
            <Heart className="w-6 h-6 text-[#9A6B1F] mx-auto" />
            <h3 className="font-bold text-[#1C1917] text-sm">ग्राहकों का भरोसा</h3>
            <p className="text-xs text-[#786C5E]">पारदर्शी मूल्य और WhatsApp पर व्यक्तिगत बातचीत से सहायता।</p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#9A6B1F] mx-auto" />
            <h3 className="font-bold text-[#1C1917] text-sm">विश्वसनीय डिलीवरी</h3>
            <p className="text-xs text-[#786C5E]">सुरक्षित पैकेजिंग एवं आसान वापसी व बदलाव का वादा।</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-[#E8DFD5] text-center">
          <p className="text-xs text-[#786C5E] mb-3">
            हमारे स्टोर पर प्रत्यक्ष आकर नए कलेक्शन को देखें:
          </p>
          <button
            type="button"
            onClick={onNavigateToContact}
            className="px-6 py-3 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl text-xs sm:text-sm font-bold font-hindi transition-colors shadow-xs"
          >
            दुकान का पता व संपर्क देखें
          </button>
        </div>
      </div>

    </div>
  );
};
