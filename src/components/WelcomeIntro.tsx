import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, Crown, ArrowRight } from 'lucide-react';

interface WelcomeIntroProps {
  onComplete: () => void;
  logoUrl?: string;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({
  onComplete,
  logoUrl = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png"
}) => {
  const [currentSlide, setCurrentSlide] = useState<1 | 2 | 3>(1);
  const [typedGreeting, setTypedGreeting] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  // Typewriter effect for Slide 1: “राम राम सा” (Slow, serene & devotional)
  useEffect(() => {
    if (currentSlide === 1) {
      const fullText = "राम राम सा";
      let currentIndex = 0;
      setTypedGreeting('');
      
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedGreeting(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 160);

      // Slide 1 duration: ~3.0 seconds
      const timer = setTimeout(() => {
        setCurrentSlide(2);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentSlide]);

  // Slide 2 transition timer (~2.8 seconds)
  useEffect(() => {
    if (currentSlide === 2) {
      const timer = setTimeout(() => {
        setCurrentSlide(3);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Slide 3 auto-transition timer (~3.5 seconds) then enter
  useEffect(() => {
    if (currentSlide === 3) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, onComplete]);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="सेठ सांवरिया कलेक्शन स्वागत प्रस्तुति"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0A0704] select-none h-dvh w-full max-w-[100vw] px-3 py-4 touch-none overscroll-none"
    >
      {/* Royal Mobile-First 9:16 Portrait Background */}
      <div className="absolute inset-0 bg-radial from-[#2C140A]/90 via-[#150B06]/95 to-[#070402] pointer-events-none" />

      {/* Ornate Gold Filigree Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #E2B158 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient Golden Halo Glow - Clamped to prevent viewport expansion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#92400E]/15 to-transparent blur-2xl pointer-events-none animate-pulse" />

      {/* Floating Shimmer Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 left-6 w-1.5 h-1.5 rounded-full bg-[#FFE5A3] blur-[0.5px] animate-ping" style={{ animationDuration: '3.2s' }} />
        <div className="absolute top-2/3 right-8 w-2 h-2 rounded-full bg-[#F3D082] blur-[1px] animate-pulse" style={{ animationDuration: '2.4s' }} />
        <div className="absolute top-1/3 right-10 w-1.5 h-1.5 rounded-full bg-[#E2B158] blur-[0.5px] animate-ping" style={{ animationDuration: '4.2s' }} />
        <div className="absolute bottom-1/4 left-10 w-1 h-1 rounded-full bg-[#F59E0B] animate-pulse" />
      </div>

      {/* Top Header Controls: Store Emblem & Skip Button */}
      <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-5 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-hindi font-bold text-[#E2B158] bg-[#1C120A]/90 px-2.5 py-1 rounded-full border border-[#D4AF37]/35 backdrop-blur-md shadow-xs">
          <Crown className="w-3 h-3 text-[#E2B158]" />
          <span>शाही संग्रह</span>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="px-3 py-1 rounded-full bg-[#1C120A]/90 hover:bg-[#2C1D10] border border-[#D4AF37]/50 text-[#E2B158] text-[11px] sm:text-xs font-hindi font-semibold flex items-center gap-1 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg hover:border-[#D4AF37]"
          aria-label="स्वागत स्क्रीन छोड़ें और सीधे वेबसाइट पर जाएँ"
        >
          <span>आगे बढ़ें</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Step Indicator Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {[1, 2, 3].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentSlide(step as any)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              currentSlide === step
                ? 'w-7 bg-gradient-to-r from-[#E2B158] to-[#FFE8A3] shadow-[0_0_10px_rgba(226,177,88,0.9)]'
                : 'w-2 bg-[#44382C]'
            }`}
            aria-label={`स्लाइड ${step} पर जाएं`}
          />
        ))}
      </div>

      {/* Main Slide Carousel (Strict 9:16 Mobile Portrait Frame, perfectly centered on any phone) */}
      <div className="relative z-20 w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center justify-center text-center my-auto overflow-hidden">
        
        {/* Royal Rajasthani Palace Arch Border Frame */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-[#1C1008]/92 via-[#140B05]/96 to-[#0F0703]/98 border-2 border-[#E2B158]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,230,160,0.3)] backdrop-blur-md overflow-hidden">
          
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#E2B158]" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E2B158]" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#E2B158]" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#E2B158]" />

          <AnimatePresence mode="wait">
            
            {/* ========================================================
                SLIDE 1 — 3D CIRCULAR LOGO + RAM RAM SA (Slow & Serene)
                ======================================================== */}
            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center w-full"
              >
                {/* Devotional Sacred Invocation */}
                <div className="mb-3 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-hindi font-bold text-[#E2B158]/95 tracking-wider uppercase">
                  <span>।। श्री सांवरिया सेठाय नमः ।।</span>
                </div>

                {/* Circular 3D Gold Logo with Radial Aura */}
                <div className="relative group my-1">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3C4] to-[#B45309] opacity-35 blur-lg animate-pulse" />
                  
                  {/* Concentric 3D Gold Rings */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-[#FFF5DA] via-[#D4AF37] to-[#4A2E1C] shadow-[0_8px_28px_rgba(212,175,55,0.45),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/70 shadow-inner">
                      {!imageFailed ? (
                        <img
                          src={logoUrl}
                          alt="सेठ सांवरिया कलेक्शन"
                          className="w-full h-full object-contain rounded-full p-1"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#E2B158] font-heading font-bold text-center">
                          <span className="text-2xl">SS</span>
                          <span className="text-[9px] tracking-widest uppercase">Sanwariya</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Serene Hindi Greeting Typewriter: “राम राम सा” */}
                <div className="mt-4 min-h-[44px] flex items-center justify-center">
                  <h2 className="text-3xl sm:text-4xl font-bold font-hindi text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6E5] via-[#E2B158] to-[#C59B27] drop-shadow-[0_2px_14px_rgba(226,177,88,0.6)] tracking-wide">
                    {typedGreeting}
                    <span className="inline-block w-1 h-6 sm:h-7 bg-[#E2B158] ml-1.5 animate-pulse align-middle" />
                  </h2>
                </div>

                <p className="mt-1.5 text-[11px] sm:text-xs font-hindi text-[#D5C2AF] tracking-wide font-medium">
                  पधारो सा · पावन परिधान व शुद्ध विश्वास
                </p>

                <p className="mt-1 text-[10px] sm:text-[11px] font-hindi text-[#E2B158]/90 font-semibold">
                  कातर छोटी, राजस्थान – 331517
                </p>
              </motion.div>
            )}

            {/* ========================================================
                SLIDE 2 — ROYAL WELCOME & HERITAGE VIBE
                ======================================================== */}
            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-1 w-full"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2C180E] border border-[#D4AF37]/40 text-[#E2B158] text-[10px] uppercase tracking-[0.16em] mb-3 shadow-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-[#E2B158]" />
                  <span>Royal Rajasthani Heritage</span>
                </div>

                {/* Grand Royal "Welcome" */}
                <h1 className="font-heading font-medium tracking-[0.08em] text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B158] to-[#996D1E] drop-shadow-[0_4px_20px_rgba(212,175,55,0.45)]">
                  Welcome
                </h1>

                {/* Traditional Decorative Divider */}
                <div className="my-3 flex items-center justify-center gap-2">
                  <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#E2B158]" />
                  <span className="w-2 h-2 rotate-45 border border-[#E2B158] bg-[#120D08]" />
                  <div className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#E2B158]" />
                </div>

                <p className="text-sm sm:text-base font-hindi text-[#FFF0D4] font-semibold tracking-wide">
                  पधारो म्हारे देश
                </p>

                <p className="mt-1.5 text-[11px] sm:text-xs font-hindi text-[#D5C2AF] leading-relaxed max-w-[260px]">
                  विवाह व उत्सवों के लिए प्रामाणिक शेरवानी, कुर्ते, सिल्क साड़ियां व एथनिक परिधान
                </p>

                <div className="mt-4 flex items-center gap-1 text-[10px] sm:text-[11px] font-hindi text-[#E2B158] bg-[#221309] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  <span>कातर छोटी का प्रतिष्ठित परिधान स्टोर</span>
                </div>
              </motion.div>
            )}

            {/* ========================================================
                SLIDE 3 — 3D STORE BRANDING & ENTER STORE BUTTON
                ======================================================== */}
            {currentSlide === 3 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center w-full py-1"
              >
                {/* Circular 3D Logo */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-b from-[#FFF5DA] via-[#E2B158] to-[#4A2E1C] shadow-[0_0_24px_rgba(226,177,88,0.4)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/70">
                      {!imageFailed ? (
                        <img
                          src={logoUrl}
                          alt="SETH SANWARIYA COLLECTION"
                          className="w-full h-full object-contain rounded-full p-1"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <span className="text-[#E2B158] font-heading font-bold text-lg">SSC</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3D Gold Store Title */}
                <h1 className="text-lg sm:text-xl font-heading font-bold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B158] to-[#996D1E] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight uppercase text-center">
                  SETH SANWARIYA
                  <span className="block text-sm sm:text-base tracking-[0.16em] font-light text-[#E5C178] mt-0.5">
                    COLLECTION
                  </span>
                </h1>

                {/* Hindi Name */}
                <p className="mt-1.5 text-xs sm:text-sm font-hindi font-semibold text-[#F3E8D8] tracking-wide">
                  सेठ सांवरिया कलेक्शन
                </p>

                {/* Exact Verified Location */}
                <p className="mt-0.5 text-[10px] sm:text-xs font-hindi text-[#D4AF37] font-bold">
                  कातर छोटी, राजस्थान – 331517
                </p>

                {/* Direct High-Vibe Enter Button */}
                <button
                  type="button"
                  onClick={onComplete}
                  className="mt-4 w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#D4AF37] via-[#F3D082] to-[#B8860B] hover:from-[#E2B158] hover:to-[#C59B27] text-[#1A0F07] rounded-xl font-bold font-hindi text-xs sm:text-sm shadow-[0_6px_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current text-[#1A0F07]" />
                  <span>शाही संग्रह में प्रवेश करें</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1A0F07]" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
