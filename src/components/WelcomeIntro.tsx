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

  // Typewriter effect for Slide 1: "राम राम सा"
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
      }, 120);

      // Slide 1 transition timer (~2.0 seconds)
      const timer = setTimeout(() => {
        setCurrentSlide(2);
      }, 2100);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [currentSlide]);

  // Slide 2 transition timer (~2.0 seconds)
  useEffect(() => {
    if (currentSlide === 2) {
      const timer = setTimeout(() => {
        setCurrentSlide(3);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  // Slide 3 transition timer (~2.2 seconds) then finish
  useEffect(() => {
    if (currentSlide === 3) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const handleFinish = () => {
    try {
      sessionStorage.setItem('sanwariya_welcome_intro_seen', 'true');
    } catch {
      // ignore
    }
    onComplete();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="सेठ सांवरिया कलेक्शन स्वागत प्रस्तुति"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0704] select-none"
    >
      {/* Luxury Background: Deep rich black, royal maroon and antique gold illumination */}
      <div className="absolute inset-0 bg-radial from-[#2A1810]/70 via-[#120D08]/90 to-[#070503] pointer-events-none" />

      {/* Subtle Golden Glow / Light Rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#D4AF37]/15 via-[#B45309]/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-[#E2B158] blur-[0.5px] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-2/3 left-4/5 w-2 h-2 rounded-full bg-[#F3D082] blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#E2B158] blur-[0.5px] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[#F59E0B] animate-pulse" />
      </div>

      {/* Small Skip Button ("आगे बढ़ें / Skip") */}
      <button
        type="button"
        onClick={handleFinish}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 px-3.5 py-1.5 rounded-full bg-[#1C1510]/80 hover:bg-[#2C2016] border border-[#D4AF37]/40 text-[#E2B158] text-xs font-hindi font-medium flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg hover:border-[#D4AF37]"
        aria-label="स्वागत प्रस्तुति छोड़ें और वेबसाइट पर जाएँ"
      >
        <span>आगे बढ़ें</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentSlide === step
                ? 'w-7 bg-[#E2B158] shadow-[0_0_8px_rgba(226,177,88,0.8)]'
                : 'w-2 bg-[#44382C]'
            }`}
          />
        ))}
      </div>

      {/* Main Slide Carousel Content */}
      <div className="relative z-20 w-full max-w-lg px-6 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          
          {/* ========================================================
              SLIDE 1 — LOGO + RAM RAM SA
              ======================================================== */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Perfectly Circular Logo with Gold Frame and Soft Pulse */}
              <div className="relative group">
                {/* Golden Halo Glow */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B45309] opacity-40 blur-md animate-pulse" />
                
                {/* Circular Gold Outer Ring */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-b from-[#E2B158] via-[#B8860B] to-[#5C4033] shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/50">
                    {!imageFailed ? (
                      <img
                        src={logoUrl}
                        alt="सेठ सांवरिया कलेक्शन"
                        className="w-full h-full object-contain rounded-full p-1 transition-transform duration-700 hover:scale-105"
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#E2B158] font-heading font-bold text-center">
                        <span className="text-2xl sm:text-3xl">SS</span>
                        <span className="text-[10px] tracking-widest uppercase">Sanwariya</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Typed Hindi Greeting: “राम राम सा” */}
              <div className="mt-8 min-h-[48px] flex items-center justify-center">
                <h2 className="text-3xl sm:text-5xl font-bold font-hindi text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7CE] via-[#E2B158] to-[#C59B27] drop-shadow-[0_2px_12px_rgba(226,177,88,0.45)] tracking-wide">
                  {typedGreeting}
                  <span className="inline-block w-1 h-7 sm:h-9 bg-[#E2B158] ml-1.5 animate-pulse align-middle" />
                </h2>
              </div>

              <p className="mt-2 text-xs sm:text-sm font-hindi text-[#D5C2AF]/80 tracking-wider">
                शुभ परिधान, पावन विश्वास
              </p>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 2 — WELCOME (Golden font, particles, light sweep)
              ======================================================== */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center py-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C1F14]/70 border border-[#D4AF37]/30 text-[#E2B158] text-xs uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#E2B158]" />
                <span>Exquisite Experience</span>
              </div>

              {/* Elegant Luxury "Welcome" */}
              <h1 className="relative font-heading font-medium tracking-[0.2em] text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF6D1] to-[#AA7C11] drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)]">
                Welcome
              </h1>

              {/* Soft decorative divider */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#E2B158]" />
                <span className="w-2 h-2 rotate-45 border border-[#E2B158] bg-[#120D08]" />
                <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#E2B158]" />
              </div>

              <p className="mt-3 text-xs sm:text-sm font-hindi text-[#C5B3A1] tracking-widest">
                आपका हार्दिक स्वागत है
              </p>
            </motion.div>
          )}

          {/* ========================================================
              SLIDE 3 — STORE BRANDING (SETH SANWARIYA COLLECTION 3D Gold)
              ======================================================== */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Circular Logo */}
              <div className="relative mb-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-[#E2B158] via-[#B8860B] to-[#4A3222] shadow-[0_0_25px_rgba(226,177,88,0.35)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#120D08] flex items-center justify-center border border-[#E2B158]/50">
                    {!imageFailed ? (
                      <img
                        src={logoUrl}
                        alt="SETH SANWARIYA COLLECTION"
                        className="w-full h-full object-contain rounded-full p-1"
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <span className="text-[#E2B158] font-heading font-bold text-xl">SSC</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Name 3D Gold Style Treatment */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DA] via-[#E2B158] to-[#996D1E] drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] leading-tight uppercase text-center">
                SETH SANWARIYA
                <span className="block text-xl sm:text-2xl tracking-[0.24em] font-light text-[#E5C178] mt-1">
                  COLLECTION
                </span>
              </h1>

              {/* Hindi Subtitle */}
              <p className="mt-3 text-sm sm:text-base font-hindi font-medium text-[#F3E8D8] tracking-wide">
                सेठ सांवरिया कलेक्शन
              </p>

              {/* Location Badge */}
              <p className="mt-1 text-xs font-hindi text-[#A89886] tracking-normal">
                कातर छोटी, राजस्थान – 331517
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-hindi text-[#D5C2AF] bg-[#1E1712] px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
                <span>वेबसाइट लोड हो रही है...</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
