import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Award, RefreshCw } from 'lucide-react';

export default function ShowcaseSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "PREMIUM FOOTWEAR CRAFT",
      desc: "Engineered with ballistic leather and individually hand-inspected for flawless stitch precision."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "EXPRESS WORLDWIDE DROP",
      desc: "Custom shockproof sneaker box packaging guarantees safe and pristine delivery to your door."
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "LIMITED EDITION SERIAL",
      desc: "Includes an engraved metal tongue plaque stamped with your pair's unique production number."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      title: "PERFECT FIT GUARANTEE",
      desc: "30-day hassle-free size exchange guarantee on all limited sneaker releases."
    }
  ];

  return (
    <section className="relative w-full h-[100dvh] snap-start snap-always flex-shrink-0 flex items-center justify-center overflow-hidden px-6 sm:px-12 py-24 bg-[#e88d72]">
      
      {/* Background Soft Glow matching the coral theme */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[45vw] aspect-square rounded-full bg-white/20 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full z-10">
        
        {/* Top Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
            ENGINEERED FOR SNEAKERHEADS
          </span>
        </div>

        {/* Massive Kinetic Header in Anton Font */}
        <div className="relative mb-6 select-none">
          <span 
            className="absolute left-0 top-0 font-['Anton'] text-4xl sm:text-6xl lg:text-7xl tracking-wide leading-[0.95] text-transparent opacity-20 pointer-events-none uppercase"
            style={{ WebkitTextStroke: '2px #ffffff' }}
          >
            UNMATCHED COMFORT & DESIGN.
          </span>
          <h2 className="relative font-['Anton'] text-4xl sm:text-6xl lg:text-7xl tracking-wide leading-[0.95] text-white uppercase">
            UNMATCHED COMFORT & DESIGN.
          </h2>
        </div>

        <p className="text-white/90 text-sm sm:text-base max-w-xl mb-10 leading-relaxed font-medium">
          Blending tactical ergonomics with street elegance. Weather-resistant materials, adaptive cushioning, and ultra-exclusive drops built to stand out on every stride.
        </p>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
            >
              <div className="mb-4 p-3.5 w-fit rounded-2xl bg-white/20 border border-white/30 shadow-inner">
                {item.icon}
              </div>
              <div>
                <h3 className="font-['Anton'] text-white text-xl tracking-wide uppercase mb-2">
                  {item.title}
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/30">
          <p className="font-['Anton'] text-sm sm:text-base text-white tracking-wide uppercase">
            NEED A CUSTOM SIZING FITTING OR SPECIAL DROP INQUIRY? REACH OUT DIRECTLY.
          </p>

          <a 
            href="/contact"
            className="group relative flex items-center gap-3 bg-white text-[#e88d72] font-bold uppercase tracking-widest px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,255,0.6)] active:scale-95 shadow-xl text-xs sm:text-sm no-underline"
          >
            <span className="relative z-10 flex items-center gap-2 font-black">
              Visit Contact Portal
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}