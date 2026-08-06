import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TOTAL_FRAMES = 120; 

const AppleCanvasLanding = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Butter-Smooth Physics & Idle Loop Refs
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const velocityRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const timeRef = useRef(0);
  const idleFactorRef = useRef(0);

  // 1. Preload image sequence into memory
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameIndex}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load frame: /frames/ezgif-frame-${frameIndex}.jpg`);
      };

      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // 2. Render Canvas with Active Idle Bounce Loop + Spring Physics
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 1080;

    let animationFrameId;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      const scrollProgress = Math.max(0, Math.min(scrollTop / (maxScroll || 1), 1));

      setScrollPercentage(Math.round(scrollProgress * 100));
      targetFrameRef.current = scrollProgress * (TOTAL_FRAMES - 1);

      // Track active scrolling vs idle pause
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Physics + Living Idle Oscillation Loop
    const render = () => {
      timeRef.current += 0.025;

      const targetIdle = isScrollingRef.current ? 0 : 1;
      idleFactorRef.current += (targetIdle - idleFactorRef.current) * 0.05;

      const breathingOffset = Math.sin(timeRef.current) * 1.2 * idleFactorRef.current;
      const effectiveTarget = targetFrameRef.current + breathingOffset;

      const dist = effectiveTarget - currentFrameRef.current;

      velocityRef.current += dist * 0.035;
      velocityRef.current *= 0.86;

      currentFrameRef.current += velocityRef.current;

      const frameToDraw = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      setCurrentFrameNum(frameToDraw + 1);

      if (images[frameToDraw]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[frameToDraw], 0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, images]);

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const sidePanelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased">

      {/* FULL-SCREEN CANVAS VIEWPORT WRAPPER (Fully transparent with zero blur) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />
      </motion.div>

      {/* TRANSPARENT HUD OVERLAY BORDER */}
      <div className="fixed inset-3 md:inset-6 rounded-3xl border border-white/10 pointer-events-none z-30 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />

      {/* LOADING SCREEN */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black text-white font-sans gap-4">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium tracking-wide">Initializing 3D Viewport...</p>
        </div>
      )}

      {/* SCROLL SECTIONS */}
      <div className="relative z-20 w-full h-[400vh]">
        
        {/* Section 1: Hero Page */}
        <section className="h-[100vh] flex flex-col items-center justify-center p-6 sm:p-12 relative">
          
          {/* Main Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative max-w-7xl mx-auto z-10"
          >
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]"
            >
              Bravos ✶
            </h1>

            <p 
              className="text-xl md:text-2xl text-slate-100 font-light tracking-wide max-w-2xl mx-auto opacity-90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
            >
              Shoe Comfort beyond limitations.
            </p>
          </motion.div>

          {/* LEFT SIDE PANEL: GOT Origin / Titan of Braavos */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={sidePanelVariants}
            className="hidden lg:flex flex-col max-w-[260px] absolute left-12 top-1/2 -translate-y-1/2 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl z-10"
          >
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              ORIGIN // BRAAVOS
            </span>
            <h3 className="text-base font-bold text-white mb-2 tracking-wide">
              The Titan's Legacy
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Inspired by the unconquerable Free City of <span className="text-white font-medium">Braavos</span> in <em>Game of Thrones</em>—built upon independence, ironclad resilience, and unrivaled strength.
            </p>
          </motion.div>

          {/* RIGHT SIDE PANEL: Valar Morghulis / Philosophy */}
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={sidePanelVariants}
            className="hidden lg:flex flex-col max-w-[260px] absolute right-12 top-1/2 -translate-y-1/2 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl text-right z-10"
          >
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              PHILOSOPHY // GOT
            </span>
            <h3 className="text-base font-bold text-white mb-2 tracking-wide">
              Boundless Mastery
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Just as the Iron Bank and Secret City forged their own destiny across the Narrow Sea, <span className="text-white font-medium">Bravos</span> embodies fearless engineering and absolute freedom of movement.
            </p>
          </motion.div>

          {/* Scroll Prompt Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <div className="w-5 h-9 border-2 border-white/40 rounded-full flex justify-center p-1 bg-black/20">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1.5 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              />
            </div>
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Scroll to Orbit
            </span>
          </motion.div>
        </section>

        {/* Section 2: Features 01 & 02 */}
        <section className="h-[100vh] flex flex-col md:flex-row items-center justify-between p-6 sm:p-12 md:px-28 gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: false }}
            variants={textVariants}
            className="max-w-md bg-black/50 border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider mb-2 block uppercase opacity-80">01 // Handmade</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Handcrafted Precision
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-light opacity-90">
              Bravos footwear is meticulously crafted by hand, combining traditional shoemaking techniques with modern refined design. Every detail receives human touch and unwavering attention to quality.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: false }}
            variants={textVariants}
            className="max-w-md bg-black/50 border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider mb-2 block uppercase opacity-80">02 // Ergonomics</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Adaptive Sole System
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-light opacity-90">
              Engineered with multi-density shock absorption soles that respond dynamically to stride movement, ensuring maximum energy return and all-day stability.
            </p>
          </motion.div>
        </section>

        {/* Section 3: Features 03 & 04 */}
        <section className="h-[100vh] flex flex-col md:flex-row items-center justify-between p-6 sm:p-12 md:px-28 gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: false }}
            variants={textVariants}
            className="max-w-md bg-black/50 border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider mb-2 block uppercase opacity-80">03 // MATERIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Aerodynamic Weave
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-light opacity-90">
              Constructed with high-tenacity breathable micro-mesh uppers that optimize airflow and thermal regulation while maintaining absolute structural integrity.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: false }}
            variants={textVariants}
            className="max-w-md bg-black/50 border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider mb-2 block uppercase opacity-80">04 // ARCHITECTURE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Reliable Traction
            </h2>
            <p className="text-base text-gray-200 leading-relaxed font-light opacity-90">
              Equipped with an enhanced, slip-resistant outsole that delivers confident grip and stability across a wide variety of urban surfaces and environments.
            </p>
          </motion.div>
        </section>

        {/* Section 4: Call to Action */}
        <section className="h-[100vh] flex flex-col items-center justify-center p-6 sm:p-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: false }}
            variants={textVariants}
            className="text-center bg-black/50 border border-white/20 p-10 md:p-16 rounded-3xl shadow-2xl relative"
          >
            <span className="text-xs font-mono text-cyan-400 tracking-widest mb-3 block uppercase opacity-80">Reserve Your Unit</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Get yours now
            </h2>
            
            <button 
              onClick={() => navigate('/ToonHubHero')}
              className="bg-white text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] cursor-pointer"
            >
              Order your Bravos Now ➤
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default AppleCanvasLanding;