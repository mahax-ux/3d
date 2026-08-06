import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductSection({ product, index, refProp, isActive, addToCart }) {
  // Assigning a unique ID (prod_01, prod_02, prod_03, prod_04) based on index
  const uniqueId = `prod_0${index + 1}`;
  const productWithId = { ...product, id: uniqueId };

  return (
    <section 
      id={`product-${index}`}
      ref={refProp}
      data-section={index}
      className="relative w-full h-[100dvh] snap-start snap-always flex-shrink-0 flex items-center justify-center overflow-hidden"
    >
      <div 
        className={`absolute right-0 md:right-[10%] top-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] aspect-square rounded-full blur-[100px] opacity-40 mix-blend-overlay pointer-events-none transition-all duration-[1200ms] ease-out ${isActive ? 'scale-100' : 'scale-50'}`}
        style={{ backgroundColor: product.panel }}
      />

      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-20 z-10 h-full py-16 md:py-0">
        
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
          
          {/* Rating, Stock Badges & Product ID for testing */}
          <div className={`transition-all duration-700 ease-out delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-white/90">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                <span className="ml-1 text-sm font-medium tracking-wide">4.9 (128 Reviews)</span>
              </div>

              {/* Scarcity Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Only 14 Left
              </span>

              {/* Visible Unique Product ID Badge for Testing */}
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
                ID: {uniqueId}
              </span>
            </div>
          </div>

          {/* Kinetic Outline Title */}
          <div className={`relative mb-2 select-none transition-all duration-700 ease-out delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span 
              className="absolute left-0 top-0 font-['Anton'] text-5xl sm:text-7xl lg:text-8xl tracking-wide leading-[0.9] text-transparent opacity-20 pointer-events-none"
              style={{ WebkitTextStroke: '2px white' }}
            >
              {product.name}
            </span>
            <h2 className="relative font-['Anton'] text-5xl sm:text-7xl lg:text-8xl tracking-wide leading-[0.9] text-white">
              {product.name}
            </h2>
          </div>
          
          <div className={`font-['Anton'] text-3xl sm:text-4xl lg:text-5xl opacity-90 mb-6 sm:mb-8 text-white/90 transition-all duration-700 ease-out delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            ₹{product.price.toFixed(2)}
          </div>

          <p className={`text-white/80 text-base sm:text-lg mb-8 max-w-lg leading-relaxed transition-all duration-700 ease-out delay-[400ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {product.desc}
          </p>

          <div className={`flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12 transition-all duration-700 ease-out delay-[500ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {product.features.map((feature, idx) => (
              <span key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide uppercase">
                {feature}
              </span>
            ))}
          </div>

          {/* Shimmer Button */}
          <div className={`transition-all duration-700 ease-out delay-[600ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              onClick={() => addToCart(productWithId)}
              className="group relative flex items-center justify-center gap-4 bg-white text-black font-bold uppercase tracking-widest px-8 py-5 rounded-full w-full sm:w-fit overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-3">
                <ShoppingCart size={20} strokeWidth={2.5} />
                Add to Collection
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 ease-in-out" />
            </button>
          </div>
        </div>

        {/* 3D Figurine View */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[75vh] flex items-center justify-center relative" style={{ perspective: '1200px' }}>
          <img 
            src={product.src} 
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] toonhub-3d-image"
            style={{
              transformStyle: 'preserve-3d',
              transform: isActive 
                ? 'rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)' 
                : 'rotateX(20deg) rotateY(-30deg) scale(0.7) translateZ(-150px) translateY(80px)',
              opacity: isActive ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out'
            }}
          />
        </div>

      </div>
    </section>
  );
}