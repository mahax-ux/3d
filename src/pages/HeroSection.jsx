import React from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { IMAGES, CAROUSEL_TRANSITIONS } from './data';

export default function HeroSection({ refProp, activeIndex, isMobile, navigate }) {
  const getRoleStyles = (index) => {
    const isCenter = index === activeIndex;
    const isLeft = index === (activeIndex + 3) % 4;
    const isRight = index === (activeIndex + 1) % 4;

    // 🎯 ADJUSTED LINE: Changed 'bottom' to center the shoe vertically
    if (isCenter) return { transform: `translateX(-50%) scale(${isMobile ? 1.8 : 2.6})`, filter: 'blur(0px)', opacity: 1, zIndex: 20, left: '50%', height: isMobile ? '75%' : '115%', bottom: isMobile ? '35%' : '18%' };
    
    if (isLeft) return { transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
    if (isRight) return { transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
    return { transform: 'translateX(-50%) scale(1)', filter: 'blur(4px)', opacity: 1, zIndex: 5, left: '50%', height: isMobile ? '13%' : '22%', bottom: isMobile ? '32%' : '12%' };
  };

  return (
    <section 
      ref={refProp} 
      data-section="hero" 
      className="relative w-full h-[100dvh] snap-start snap-always overflow-hidden flex-shrink-0"
      style={{ perspective: '1200px' }}
    >
      <div 
        className="absolute inset-x-0 top-[18%] z-[2] flex items-center justify-center pointer-events-none select-none uppercase text-white leading-none whitespace-nowrap tracking-[-0.02em] animate-hero-3d-title" 
        style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900 }}
      >
        Bravos
      </div>

      <div className="absolute inset-0 z-[3]">
        {IMAGES.map((item, index) => {
          const isCenter = index === activeIndex;
          return (
            <div 
              key={item.src} 
              className={`absolute ${isCenter ? 'animate-hero-center-3d' : ''}`}
              style={{ 
                aspectRatio: '0.6 / 1', 
                willChange: 'transform, filter, opacity', 
                transition: CAROUSEL_TRANSITIONS, 
                ...getRoleStyles(index) 
              }}
            >
              <img 
                src={item.src} 
                alt={`Figurine ${index + 1}`} 
                draggable={false} 
                className={`w-full h-full object-contain object-bottom pointer-events-none select-none ${isCenter ? 'toonhub-hero-float' : ''}`} 
              />
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 z-50 max-w-[320px] animate-hero-fade-in-up">
        <p className="font-bold uppercase tracking-[0.02em] mb-2 sm:mb-3 text-base sm:text-[22px] text-white/95">
          Bravos Shoes
        </p>
        <p className="hidden sm:block text-xs sm:text-sm text-white/85 mb-4 sm:mb-5 leading-[1.6]">
          The BRAVOS are Game of Thrones-inspired sneakers blending the stealth and elegance of Braavos with tactical design. Featuring a Valyrian Steel Silver and Obsidian Black colorway, they boast weather-resistant ballistic leather, reflective "Valar Morghulis" heel stamping, gunmetal iron-coin aglets, and silent, adaptive cushioning built for the agility of a Water Dancer
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('prev')} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent transition-all hover:scale-[1.08] hover:bg-white/12 active:scale-95">
            <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
          </button>
          <button onClick={() => navigate('next')} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 border-white text-white bg-transparent transition-all hover:scale-[1.08] hover:bg-white/12 active:scale-95">
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce flex flex-col items-center text-white/60 sm:flex pointer-events-none">
        <span className="text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">Scroll</span>
        <ChevronDown size={20} strokeWidth={2.5} />
      </div>

      <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 z-50 animate-hero-fade-in-up">
        <a href="#product-0" className="group flex items-center gap-2 sm:gap-3 text-white uppercase no-underline opacity-95 hover:opacity-100 transition-opacity duration-200 tracking-[-0.02em] leading-none" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 56px)' }}>
          <span>DISCOVER More</span>
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0" strokeWidth={2.25} />
        </a>
      </div>
    </section>
  );
}