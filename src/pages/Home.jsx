import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../components/Loader'
import Island from '../models/Island'
import Sky from '../models/Sky'
import HomeInfo from '../components/HomeInfo'
import Plane from '../models/Plane'

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [theme, setTheme] = useState('day');
  const [isLoaded, setIsLoaded] = useState(false);

  // Guarantees trigger every time page reloads or route navigation occurs
  useEffect(() => {
    setIsLoaded(false); // Reset first
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const isNight = theme === 'night';

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -10, -50];
    let rotation = [0.1, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.8, 0.8, 0.8];
      screenPosition = [0, -8, -50];
    } else {
      screenScale = [1, 1, 1];
    }
    return [screenScale, screenPosition, rotation];
  };

  const adjustPlaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [4, 4, 4];
      screenPosition = [0, 0, 0];
    } else {
      screenScale = [8.5, 8.5, 8.5];
      screenPosition = [0, 0, 0];
    }
    return [screenScale, screenPosition];
  };

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
  const [planeScale, planePosition] = adjustPlaneForScreenSize();

  return (
    <section className={`w-full h-screen relative transition-colors duration-1000 ${isNight ? 'bg-[#030712]' : 'bg-[#cae9ff]'}`}>
      
      {/* Container with guaranteed reload/route fade-up animation */}
      <div 
        className={`w-full h-full relative transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-16 scale-[0.97]'
        }`}
      >
        {/* Header Info */}
        <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="pointer-events-auto [&_div]:flex [&_div]:flex-col [&_div]:items-center [&_div]:justify-center [&_div]:pt-6 [&_div]:pb-5 [&_div]:px-8 [&_p]:text-center [&_p]:mb-4 [&_p]:w-full [&_a]:whitespace-nowrap [&_a]:flex [&_a]:items-center [&_a]:justify-center [&_a]:gap-2 [&_a]:w-auto [&_div]:w-auto [&_div]:max-w-md">
            {currentStage && <HomeInfo currentStage={currentStage} />}
          </div>
        </div>

        {/* Left Center Guidance Hint */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 z-20 hidden md:flex items-center gap-2 px-4 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-xl border-2 border-white/80 text-sm animate-bounce pointer-events-none">
          <span>← Use Left</span>
          <span className="text-xs text-sky-100 font-normal">to view 3D</span>
        </div>

        {/* Right Center Guidance Hint */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 hidden md:flex items-center gap-2 px-4 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-xl border-2 border-white/80 text-sm animate-bounce pointer-events-none">
          <span className="text-xs text-sky-100 font-normal">to view 3D</span>
          <span>Use Right →</span>
        </div>

        {/* Glassmorphism Icon Toggle Button (Moved down to top-24 right-8) */}
        <div className="absolute top-24 right-8 z-30 animate-fade-in">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-500 transform hover:scale-110 active:scale-95 border flex items-center justify-center ${
              isNight
                ? 'bg-slate-900/80 text-amber-300 border-amber-400/30 hover:border-amber-400/60 shadow-amber-500/20'
                : 'bg-white/80 text-amber-500 border-sky-300/50 hover:border-sky-400 shadow-sky-500/20'
            }`}
          >
            <span className="text-2xl leading-none select-none">
              {isNight ? '🌙' : '☀️'}
            </span>
          </button>
        </div>

        {/* 3D Canvas Container */}
        <Canvas
          shadows
          className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
          camera={{
            position: [0, 20, 60],
            fov: 60,
          }}
          gl={{ powerPreference: 'high-performance', antialias: true }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight 
              position={[20, 60, 20]} 
              intensity={isNight ? 0.1 : 2.5} 
              color={isNight ? '#5c78a5' : '#fff4e0'} 
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={120}
              shadow-camera-left={-40}
              shadow-camera-right={40}
              shadow-camera-top={40}
              shadow-camera-bottom={-40}
              shadow-bias={-0.0005}
            />

            <hemisphereLight 
              skyColor={isNight ? '#080c16' : '#cae9ff'} 
              groundColor={isNight ? '#000000' : '#3d2a10'} 
              intensity={isNight ? 0.08 : 1.2} 
            />

            <ambientLight 
              intensity={isNight ? 0.03 : 0.3} 
              color={isNight ? '#101828' : '#ffffff'} 
            />

            <Sky isRotating={isRotating} theme={theme} />
            
            <Island
              position={islandPosition}
              scale={islandScale}
              rotation={islandRotation}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
              theme={theme}
            />

            <Plane 
              isRotating={isRotating}
              scale={planeScale}
              position={planePosition}
              theme={theme}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Home;