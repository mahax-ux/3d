import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { IMAGES, GRAIN_BG, TRANSITION_BEZIER } from './data';
import HeroSection from './HeroSection';
import ProductSection from './ProductSection';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import ShowcaseSection from './ShowcaseSection';

export default function ToonHubHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSection, setVisibleSection] = useState('hero');
  
  // Cart & Checkout States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: '', email: '', street: '', city: '', zip: '', country: 'United States'
  });

  const animTimerRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.55 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const getGlobalBackground = () => {
    if (visibleSection === 'hero') return IMAGES[activeIndex].bg;
    if (visibleSection === 'showcase') return '#0F0F12';
    const productIdx = parseInt(visibleSection);
    return !isNaN(productIdx) ? IMAGES[productIdx].bg : IMAGES[0].bg;
  };

  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    return () => clearTimeout(animTimerRef.current);
  }, []);

  const navigate = useCallback((direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4));
    animTimerRef.current = setTimeout(() => setIsAnimating(false), 650);
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (visibleSection !== 'hero' || isCartOpen || isCheckoutOpen) return;
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, visibleSection, isCartOpen, isCheckoutOpen]);

  // Cart Functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="fixed inset-0 -z-20 w-full h-full"
        style={{
          backgroundColor: getGlobalBackground(),
          transition: `background-color ${TRANSITION_BEZIER}`,
        }}
      />
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-40 w-full h-full"
        style={{
          backgroundImage: `url('${GRAIN_BG}')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* HEADER MOVED FURTHER DOWN (top-12 py-10) */}
      <header className="fixed top-12 inset-x-0 z-[100] px-6 sm:px-12 py-10 flex items-center justify-between pointer-events-none">
        <div className="text-xs font-semibold uppercase text-white/90 tracking-[0.18em] pointer-events-auto">
          
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="pointer-events-auto relative flex items-center gap-2 bg-black/30 hover:bg-black/50 border border-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-lg"
        >
          <ShoppingCart size={18} strokeWidth={2.25} />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Collection</span>
          {totalItemCount > 0 && (
            <span className="bg-white text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-1">
              {totalItemCount}
            </span>
          )}
        </button>
      </header>

      {/* PAGE 1: HERO */}
      <HeroSection 
        refProp={(el) => (sectionRefs.current[0] = el)} 
        activeIndex={activeIndex} 
        isMobile={isMobile} 
        navigate={navigate} 
      />

      {/* PAGES 2-5: PRODUCTS */}
      {IMAGES.map((product, index) => (
        <ProductSection 
          key={product.id || index}
          product={product}
          index={index}
          refProp={(el) => (sectionRefs.current[index + 1] = el)}
          isActive={visibleSection === String(index)}
          addToCart={addToCart}
        />
      ))}

      {/* PAGE 6: SHOWCASE / WHY US */}
      <section 
        id="showcase"
        ref={(el) => (sectionRefs.current[IMAGES.length + 1] = el)}
        data-section="showcase"
        className="relative w-full min-h-[100dvh] snap-start snap-always flex-shrink-0"
      >
        <ShowcaseSection />
      </section>

      {/* OVERLAYS */}
      <CartDrawer 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        setIsCheckoutOpen={setIsCheckoutOpen}
      />

      <CheckoutModal 
        isCheckoutOpen={isCheckoutOpen}
        setIsCheckoutOpen={setIsCheckoutOpen}
        orderPlaced={orderPlaced}
        handlePlaceOrder={handlePlaceOrder}
        address={address}
        handleAddressChange={handleAddressChange}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cartTotal={cartTotal}
        cart={cart}
        visibleSection={visibleSection}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes toonhub-float {
          0% { margin-top: 0px; }
          50% { margin-top: -24px; }
          100% { margin-top: 0px; }
        }
        .toonhub-3d-image, .toonhub-hero-float {
          animation: toonhub-float 6s ease-in-out infinite;
        }

        /* 3D Entrance Keyframes */
        @keyframes heroCenter3D {
          0% {
            opacity: 0;
            transform: perspective(1000px) translate3d(-50%, 60px, -300px) rotateX(25deg) rotateY(-20deg);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) translate3d(-50%, 0, 0px) rotateX(0deg) rotateY(0deg);
          }
        }

        @keyframes heroTitle3D {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateX(-20deg) translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateX(0deg) translateY(0px);
          }
        }

        @keyframes heroFadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-hero-center-3d {
          animation: heroCenter3D 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-hero-3d-title {
          animation: heroTitle3D 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-hero-fade-in-up {
          animation: heroFadeInUp 0.9s ease-out 0.2s forwards;
        }

        ::selection {
          background: #6366f1;
          color: #ffffff;
        }
      `}} />
    </div>
  );
}