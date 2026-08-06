import React, { Suspense, useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Canvas } from '@react-three/fiber';
import Fox from '../models/Fox';
import Loader from '../components/Loader';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

// Hardcoded EmailJS Credentials
const EMAILJS_SERVICE_ID = 'service_d32p1zg';
const EMAILJS_TEMPLATE_ID = 'template_69x1sqn';
const EMAILJS_PUBLIC_KEY = 'Iu5oRBE3QM5rXv296';

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger slow, elegant entrance transition on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const { alert, showAlert, hideAlert } = useAlert();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = () => setCurrentAnimation('walk');
  const handleBlur = () => setCurrentAnimation('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentAnimation('hit');

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          time: new Date().toLocaleString(), // Generates formatted current time for {{time}}
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setIsLoading(false);
        showAlert({
          show: true,
          text: 'Message sent successfully!',
          type: 'success',
        });

        setTimeout(() => {
          hideAlert();
          setCurrentAnimation('idle');
          setForm({ name: '', email: '', message: '' });
        }, 3000);
      })
      .catch((error) => {
        setIsLoading(false);
        setCurrentAnimation('idle');
        console.error(error);
        showAlert({
          show: true,
          text: 'Did not receive your message.',
          type: 'danger',
        });
      });
  };

  return (
    <section className="relative w-full min-h-[100vh] bg-white text-slate-900 overflow-hidden flex flex-col items-center justify-center px-6 sm:px-24 py-24 border-b border-slate-200" style={{ perspective: '1200px' }}>
      {alert.show && <Alert {...alert} />}

      {/* Massive Background Kinetic Title */}
      <div 
        className="absolute inset-x-0 top-[15%] z-[1] flex items-center justify-center pointer-events-none select-none uppercase text-slate-900 leading-none whitespace-nowrap tracking-[-0.02em] opacity-[0.04]" 
        style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(80px, 22vw, 320px)', fontWeight: 900 }}
      >
        BRAVOS SHOES
      </div>

      {/* Subtle Ambient Highlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-slate-200/50 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[160px] pointer-events-none" />

      {/* Centered Main Layout Container with Slow, Elegant Fade-Up Transition */}
      <div 
        className={`relative z-10 w-full max-w-6xl mx-auto flex lg:flex-row flex-col items-center justify-center gap-12 transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-[0.97]'
        }`}
      >
        
        {/* Form Container with Clean Inner Borders & Shadows */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 sm:p-10">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 block mb-2 font-bold">Get in touch</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Anton', sans-serif" }}>
            Contact Us
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Have questions about the Bravos drops or custom fittings? Drop us a message below.
          </p>

          <form
            ref={formRef}
            className="w-full flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Name</label>
              <input
                type="text"
                name="name"
                className="bg-slate-50 border border-slate-200 shadow-inner rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                className="bg-slate-50 border border-slate-200 shadow-inner rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300"
                placeholder="example@gmail.com"
                required
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Message</label>
              <textarea
                name="message"
                rows={3}
                className="bg-slate-50 border border-slate-200 shadow-inner rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 resize-none"
                placeholder="Enter your message"
                required
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button
              type="submit"
              className="group relative flex items-center justify-center gap-3 bg-slate-900 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full w-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg mt-2"
              disabled={isLoading}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <span className="relative z-10">{isLoading ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* 3D Canvas Container */}
        <div className="w-full lg:w-1/2 h-[350px] sm:h-[400px] flex items-center justify-center relative filter drop-shadow-[0_30px_35px_rgba(0,0,0,0.15)]">
          <Canvas
            camera={{
              position: [0, 0, 5.5],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
            gl={{ powerPreference: 'high-performance', antialias: true }}
          >
            <directionalLight intensity={2.5} position={[0, 0, 1]} />
            <ambientLight intensity={1.1} />
            <Suspense fallback={<Loader />}>
              <Fox
                currentAnimation={currentAnimation}
                position={[0.5, 0.35, 0]}
                rotation={[12.625, -0.6, 0]}
                scale={[0.90, 0.90, 0.90]}
              />
            </Suspense>
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default Contact;
