import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF, Html } from '@react-three/drei';
import shoeScene from '../assets/3d/cust_shoe.glb';

// Instant local HTML Loader fallback
const CustomLoader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-pink-200">
      <div className="w-7 h-7 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Loading Local Asset...</span>
    </div>
  </Html>
);

// Inner 3D Shoe Model Component
const CustomizableShoe = ({ colors }) => {
  const shoeRef = useRef();
  const { nodes } = useGLTF(shoeScene);

  return (
    <group ref={shoeRef} dispose={null}>
      {Object.entries(nodes).map(([name, node], index) => {
        if (node.isMesh) {
          const materialKey = node.material?.name || `part_${index}`;
          const appliedColor = colors[materialKey] || colors[name] || '#ffffff';

          return (
            <mesh
              key={index}
              geometry={node.geometry}
              material={node.material}
              material-color={appliedColor}
            />
          );
        }
        return null;
      })}
    </group>
  );
};

const ShoeCustomizer = () => {
  const { materials } = useGLTF(shoeScene);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger slow, elegant entrance transition on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const availableParts = React.useMemo(() => {
    const parts = {};
    if (materials) {
      Object.keys(materials).forEach((matName) => {
        parts[matName] = '#ffffff';
      });
    }
    return parts;
  }, [materials]);

  const [colors, setColors] = useState(availableParts);
  const [saveMessage, setSaveMessage] = useState('');

  const swatches = ['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f38374'];

  const handleColorChange = (part, color) => {
    setColors((prev) => ({ ...prev, [part]: color }));
  };

  const handleSaveDesign = () => {
    setSaveMessage('Design saved successfully! (Stored until refresh)');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  return (
    <section className="relative w-full min-h-[100vh] bg-[#fce7f0] text-slate-900 overflow-hidden flex flex-col items-center justify-center px-6 sm:px-24 py-24 border-b border-pink-200">
      
      {/* Background Title */}
      <div 
        className="absolute inset-x-0 top-[15%] z-[1] flex items-center justify-center pointer-events-none select-none uppercase text-pink-900 leading-none whitespace-nowrap tracking-[-0.02em] opacity-[0.05]" 
        style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(80px, 22vw, 320px)', fontWeight: 900 }}
      >
        CUSTOM LAB
      </div>

      {/* Ambient Pink Highlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-white/40 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-pink-300/30 blur-[160px] pointer-events-none" />

      {/* Centered Main Layout Container with Butter-Smooth Fade-Up Transition */}
      <div 
        className={`relative z-10 w-full max-w-7xl mx-auto flex lg:flex-row flex-col items-center justify-between gap-12 transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-[0.97]'
        }`}
      >
        
        {/* Left Side: Dynamic Customization Panel */}
        <div className="w-full lg:w-5/12 bg-white/80 backdrop-blur-2xl border border-pink-200 shadow-[0_20px_50px_rgba(236,72,153,0.08)] rounded-3xl p-8 z-20">
          <span className="text-xs uppercase tracking-[0.2em] text-pink-600 block mb-2 font-bold">Interactive Design</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            Customize Sneaker
          </h1>

          {/* Scrollable Parts Customizer List */}
          <div className="flex flex-col gap-5 max-h-[320px] overflow-y-auto pr-2 mb-6">
            {Object.keys(availableParts).map((partName) => (
              <div key={partName} className="flex flex-col gap-2 border-b border-pink-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Part: {partName}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {swatches.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(partName, color)}
                      className={`w-7 h-7 rounded-full border transition-transform ${
                        colors[partName] === color ? 'scale-125 border-slate-900 ring-2 ring-pink-300' : 'border-slate-300 hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {saveMessage && (
            <div className="mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
              {saveMessage}
            </div>
          )}

          <button 
            onClick={handleSaveDesign}
            className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest py-4 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Save Design
          </button>
        </div>

        {/* Right Side: Expanded Canvas with Smaller Shoe Model */}
        <div className="w-full lg:w-6/12 h-[450px] sm:h-[550px] flex items-center justify-center relative filter drop-shadow-[0_25px_30px_rgba(236,72,153,0.12)] bg-white/60 rounded-3xl border border-pink-100">
          <Canvas
            camera={{ position: [0, 2, 4.5], fov: 45 }}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <ambientLight intensity={1.8} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <directionalLight position={[-10, -10, -5]} intensity={1} />
            <Suspense fallback={<CustomLoader />}>
              <Center>
                <group scale={[0.85, 0.85, 0.85]}>
                  <CustomizableShoe colors={colors} />
                </group>
              </Center>
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Suspense>
          </Canvas>
        </div>

      </div>
    </section>
  );
};

useGLTF.preload(shoeScene);
export default ShoeCustomizer;