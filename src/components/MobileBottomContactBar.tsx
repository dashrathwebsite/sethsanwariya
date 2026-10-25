import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

export const MobileBottomContactBar: React.FC = () => {
  return (
    <>
      {/* 
        ========================================================================
        MOBILE FIXED BOTTOM CONTACT BAR (Mobile Priority)
        Shows exactly 6 actions in exact order:
        1. Call
        2. WhatsApp
        3. Location
        4. YouTube
        5. Instagram
        6. Facebook
        ========================================================================
      */}
      <nav 
        aria-label="त्वरित संपर्क एवं सोशल मीडिया"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#120D08]/95 backdrop-blur-lg border-t border-[#3D2F22] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden safe-area-bottom select-none"
      >
        <div className="grid grid-cols-6 items-stretch h-[60px] max-w-lg mx-auto">
          
          {/* 1. CALL */}
          <a
            href="tel:+918529095431"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform"
            aria-label="दुकानदार को कॉल करें (+91 8529095431)"
          >
            <div className="w-8 h-8 rounded-full bg-[#2A1F16] flex items-center justify-center text-[#E2B158] border border-[#E2B158]/30 group-hover:border-[#E2B158] transition-colors">
              <Phone className="w-4 h-4 text-[#E2B158]" />
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              कॉल
            </span>
          </a>

          {/* 2. WHATSAPP */}
          <a
            href="https://wa.me/918529095431"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform border-l border-[#2B2016]"
            aria-label="WhatsApp पर संदेश भेजें (+91 8529095431)"
          >
            <div className="w-8 h-8 rounded-full bg-[#1A2E20] flex items-center justify-center text-[#25D366] border border-[#25D366]/40 group-hover:border-[#25D366] transition-colors">
              <MessageCircle className="w-4 h-4 fill-[#25D366]/20 text-[#25D366]" />
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              WhatsApp
            </span>
          </a>

          {/* 3. LOCATION */}
          <a
            href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform border-l border-[#2B2016]"
            aria-label="गूगल मैप्स पर दुकान की लोकेशन देखें"
          >
            <div className="w-8 h-8 rounded-full bg-[#2E1A1A] flex items-center justify-center text-[#EA4335] border border-[#EA4335]/40 group-hover:border-[#EA4335] transition-colors">
              <MapPin className="w-4 h-4 text-[#EA4335]" />
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              लोकेशन
            </span>
          </a>

          {/* 4. YOUTUBE */}
          <a
            href="https://www.youtube.com/@seth_sanwariya_collection"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform border-l border-[#2B2016]"
            aria-label="YouTube चैनल देखें"
          >
            <div className="w-8 h-8 rounded-full bg-[#2E1717] flex items-center justify-center text-[#FF0000] border border-[#FF0000]/40 group-hover:border-[#FF0000] transition-colors">
              {/* Official YouTube SVG Icon */}
              <svg className="w-4 h-4 fill-current text-[#FF0000]" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              यूट्यूब
            </span>
          </a>

          {/* 5. INSTAGRAM */}
          <a
            href="https://www.instagram.com/seth_sanwariya_collection_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform border-l border-[#2B2016]"
            aria-label="Instagram प्रोफाइल देखें"
          >
            <div className="w-8 h-8 rounded-full bg-[#2E1824] flex items-center justify-center text-[#E1306C] border border-[#E1306C]/40 group-hover:border-[#E1306C] transition-colors">
              {/* Official Instagram SVG Icon */}
              <svg className="w-4 h-4 fill-current text-[#E1306C]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              Instagram
            </span>
          </a>

          {/* 6. FACEBOOK */}
          <a
            href="https://www.facebook.com/p/Seth-Sanwariya-61584605940951/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-0.5 text-center group active:scale-90 active:bg-white/5 transition-transform border-l border-[#2B2016]"
            aria-label="Facebook पेज देखें"
          >
            <div className="w-8 h-8 rounded-full bg-[#182638] flex items-center justify-center text-[#1877F2] border border-[#1877F2]/40 group-hover:border-[#1877F2] transition-colors">
              {/* Official Facebook SVG Icon */}
              <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="text-[10px] font-hindi font-semibold text-[#F3E8D8] mt-0.5 truncate w-full">
              Facebook
            </span>
          </a>

        </div>
      </nav>

      {/* 
        ========================================================================
        DESKTOP FLOATING QUICK-ACTION DOCK (Sensibly adapted for desktop)
        Non-intrusive floating pill on bottom right without covering page content
        ========================================================================
      */}
      <aside 
        aria-label="डेस्कटॉप त्वरित संपर्क"
        className="hidden md:flex fixed bottom-5 right-6 z-30 items-center gap-2 bg-[#120D08]/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#D4AF37]/30 shadow-2xl select-none"
      >
        <span className="text-[11px] font-hindi font-medium text-[#D5C2AF] pl-1 border-r border-[#3D2F22] pr-2.5">
          संपर्क व सोशल:
        </span>
        
        {/* Call */}
        <a 
          href="tel:+918529095431"
          className="p-1.5 rounded-full hover:bg-[#2A1F16] text-[#E2B158] transition-colors"
          title="कॉल करें (+91 8529095431)"
          aria-label="कॉल"
        >
          <Phone className="w-4 h-4" />
        </a>

        {/* WhatsApp */}
        <a 
          href="https://wa.me/918529095431"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-[#1A2E20] text-[#25D366] transition-colors"
          title="WhatsApp चैट"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
        </a>

        {/* Location */}
        <a 
          href="https://maps.app.goo.gl/NQzTTJeZxeSj55bj8"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-[#2E1A1A] text-[#EA4335] transition-colors"
          title="दुकान की लोकेशन (Google Maps)"
          aria-label="Google Maps लोकेशन"
        >
          <MapPin className="w-4 h-4" />
        </a>

        {/* YouTube */}
        <a 
          href="https://www.youtube.com/@seth_sanwariya_collection"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-[#2E1717] text-[#FF0000] transition-colors"
          title="YouTube"
          aria-label="YouTube"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/seth_sanwariya_collection_/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-[#2E1824] text-[#E1306C] transition-colors"
          title="Instagram"
          aria-label="Instagram"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        {/* Facebook */}
        <a 
          href="https://www.facebook.com/p/Seth-Sanwariya-61584605940951/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full hover:bg-[#182638] text-[#1877F2] transition-colors"
          title="Facebook"
          aria-label="Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

      </aside>
    </>
  );
};
