import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight } from 'lucide-react';

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

      // Slide 1 duration: ~2.8 seconds
      const timer = setTimeout(() => {
        setCurrentSlide(2);
      }, 2800);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentSlide]);

  // Slide 2 transition timer (~2.6 seconds)
  useEffect(() => {
    if (currentSlide === 2) {
      const timer = setTimeout(() => {
        setCurrentSlide(3);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Slide 3 transition timer (~3.0 seconds) then smoothly enter website
  useEffect(() => {
    if (currentSlide === 3) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, onComplete]);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="सेठ सांवरिया कलेक्शन स्वागत प्रस्तुति"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0704] select-none h-[100dvh] w-full"
    >
      {/* Royal Mobile-First 9:16 Portrait Canvas Background */}
      <div className="absolute inset-0 bg-radial from-[#2B170E]/80 via-[#140E08]/95 to-[#070503] pointer-events-none" />

      {/* Ambient Golden Halo Glow & Light Rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#B45309]/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-[#E2B158] blur-[0.5px] animate-ping" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-2/3 left-4/5 w-2 h-2 rounded-full bg-[#F3D082] blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#E2B158] blur-[0.5px] animate-ping" style={{ animationDuration: '4.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[#F59E0B] animate-pulse" />
      </div>

      {/* Quick Skip Button ("आगे बढ़ें") */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 px-3.5 py-1.5 rounded-full bg-[#1C1510]/80 hover:bg-[#2C2016] border border-[#D4AF37]/50 text-[#E2B158] text-xs font-hindi font-medium flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg hover:border-[#D4AF37]"
        aria-label="स्वागत स्क्रीन छोड़ें और वेबसाइट पर जाएँ"
      >
        <span>आगे बढ़ें</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-700 ${
              currentSlide === step
                ? 'w-8 bg-gradient-to-r from-[#E2B158] to-[#FFE8A3] shadow-[0_0_12px_rgba(226,177,88,0.9)]'
                : 'w-2.5 bg-[#44382C]'
            }`}
          />
        ))}
      </div>

      {/* Main Slide Carousel Content (Mobile 9:16 Portrait Optimized, Centered) */}
      <div className="relative z-20 w-full max-w-sm sm:max-w-md px-6 flex flex-col items-center justify-center text-center my-auto">
        <AnimatePresence mode="wait">
          
          {/* ========================================================
              SLIDE 1 — 3D CIRCULAR LOGO + RAM RAM SA (Slow & Serene)
              ======================================================== */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.06, y: -10 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Perfectly Circular Logo with 3D Gold Frame & Soft Glowing Pulse */}
              <div className="relative group">
                {/* Golden Halo Glow */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3C4] to-[#B45309] opacity-50 blur-xl animate-pulse" />
                
                {/* Circular 3D Gold Outer Ring */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-b from-[#FFF5DA] via-[#D4AF37] to-[#5C4033] shadow-[0_12px_36px_rgba(212,175,55,0.45),inset_0_2px_6px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border-2 border-[#E2B158]/70 shadow-inner">
                    {!imageFailed ? (
                      <img
                        src={logoUrl}
                        alt="सेठ सांवरिया कलेक्शन"
                        className="w-full h-full object-contain rounded-full p-1 transition-transform duration-1000 hover:scale-105"
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#E2B158] font-heading font-bold text-center">
                        <span className="text-3xl">SS</span>
                        <span className="text-[10px] tracking-widest uppercase">Sanwariya</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Devotional Typewriter Hindi Greeting: “राम राम सा” */}
              <div className="mt-8 min-h-[56px] flex items-center justify-center">
                <h2 className="text-4xl sm:text-5xl font-bold font-hindi text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6E5] via-[#E2B158] to-[#C59B27] drop-shadow-[0_2px_16px_rgba(226,177,88,0.6)] tracking-wide">
                  {typedGreeting}
                  <span className="inline-block w-1.5 h-8 sm:h-10 bg-[#E2B158] ml-2 animate-pulse align-middle" />
                </h2>
              </div>

              <p className="mt-3 text-xs sm:text-sm font-hindi text-[#D5C2AF] tracking-widest">
                शुभ परिधान · पावन विश्वास
              </p>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 2 — WELCOME (Pure Luxury Gold Font & Golden Shimmer)
              ======================================================== */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-6 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C1F14]/80 border border-[#D4AF37]/40 text-[#E2B158] text-[11px] uppercase tracking-[0.25em] mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E2B158]" />
                <span>Royal Luxury Fashion</span>
              </div>

              {/* Elegant Royal "Welcome" */}
              <h1 className="relative font-heading font-medium tracking-[0.16em] text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B158] to-[#996D1E] drop-shadow-[0_6px_28px_rgba(212,175,55,0.45)]">
                Welcome
              </h1>

              {/* Decorative Luxury Divider */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#E2B158]" />
                <span className="w-2.5 h-2.5 rotate-45 border border-[#E2B158] bg-[#120D08]" />
                <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[#E2B158]" />
              </div>

              <p className="mt-4 text-sm font-hindi text-[#C5B3A1] tracking-widest">
                आपका हार्दिक स्वागत है
              </p>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 3 — 3D STORE BRANDING & LOCATION (कातर छोटी, राजस्थान)
              ======================================================== */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Circular 3D Logo */}
              <div className="relative mb-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-b from-[#FFF5DA] via-[#E2B158] to-[#4A3222] shadow-[0_0_30px_rgba(226,177,88,0.4)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/60">
                    {!imageFailed ? (
                      <img
                        src={logoUrl}
                        alt="SETH SANWARIYA COLLECTION"
                        className="w-full h-full object-contain rounded-full p-1"
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <span className="text-[#E2B158] font-heading font-bold text-2xl">SSC</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3D Gold Store Name */}
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E2B158] to-[#996D1E] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight uppercase text-center">
                SETH SANWARIYA
                <span className="block text-xl sm:text-2xl tracking-[0.22em] font-light text-[#E5C178] mt-1">
                  COLLECTION
                </span>
              </h1>

              {/* Hindi Brand Name */}
              <p className="mt-3 text-sm sm:text-base font-hindi font-medium text-[#F3E8D8] tracking-wide">
                सेठ सांवरिया कलेक्शन
              </p>

              {/* Exact Location: कातर छोटी, राजस्थान – 331517 */}
              <p className="mt-1 text-xs font-hindi text-[#D4AF37] tracking-normal font-semibold">
                कातर छोटी, राजस्थान – 331517
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-xs font-hindi text-[#D5C2AF] bg-[#1E1712] px-4 py-1.5 rounded-full border border-[#D4AF37]/35 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#E2B158] animate-ping" />
                <span>स्टोर में प्रवेश हो रहा है...</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
