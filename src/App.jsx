import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Instagram, Youtube, Mail } from 'lucide-react';
import myVid from './assets/test_vid.mp4';
import panel2Img from './assets/WhatsApp Image 2026-02-17 at 15.26.45.jpeg';

const App = () => {
  // active panel index: 0=video, 1=panel2, 2=niche, 3=collaborators
  const [activePanel, setActivePanel] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });
  const sectionRefs = {
    panel0: useRef(null),
    panel2: useRef(null),
    panel4: useRef(null),
    panel5: useRef(null),
  };
  const sectionTopsRef = useRef([]);

  const { scrollYProgress: panel2Progress } = useScroll({
    target: sectionRefs.panel2,
    // Drive strictly while scrolling within Panel 2 (keeps image at 30rem on entry).
    offset: ['start start', 'end start'],
  });
  const internalProgress = useMotionValue(0);
  const [isLocked, setIsLocked] = useState(false);
  
  useEffect(() => {
    const handleWheel = (e) => {
      if (activePanel === 1) {
        const current = internalProgress.get();
        
        // If scrolling down and not finished
        if (e.deltaY > 0 && current < 1) {
          e.preventDefault();
          setIsLocked(true);
          internalProgress.set(Math.min(current + 0.08, 1));
        } 
        // If scrolling up and not back at start
        else if (e.deltaY < 0 && current > 0) {
          e.preventDefault();
          setIsLocked(true);
          internalProgress.set(Math.max(current - 0.08, 0));
        } 
        else {
          setIsLocked(false);
        }
      }
    };
  
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activePanel, internalProgress]);
  
  // Lock body scroll when internal animation is happening
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLocked]);
  
  // TRANSFORMS - Now using the internalProgress motion value
  const panel2ImgLeftMd = useTransform(internalProgress, [0, 0.5, 1], ['30rem', '5rem', '5rem']);
  const panel2ContentOpacity = useTransform(internalProgress, [0, 0.5, 0.8], [0, 0, 1]);
  const panel2ContentX = useTransform(internalProgress, [0, 0.5, 0.8], ['2rem', '2rem', '0rem']);


  const panel2ImgScale = useTransform(panel2Progress, [0, 0.8, 1], [1, 1, 0.95]);

  // const panel2ImgScale = useTransform(panel2Progress, [0, 0.35, 1], [1, 1, 0.985]);
  // Content should start showing when image reaches 20rem, and be fully visible
  // well before the pin releases. With left = 30 - 25*progress, left=20rem at 0.4.
  // const panel2ContentOpacity = useTransform(panel2Progress, [0, 0.4, 0.4], [0, 0, 1]);
  // const panel2ContentX = useTransform(panel2Progress, [0, 0.4, 0.4], ['2rem', '2rem', '0rem']);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => setIsMdUp(mq.matches);
    onMq();
    mq.addEventListener?.('change', onMq);

    const refreshPositions = () => {
      const refsInOrder = [
        sectionRefs.panel0,
        sectionRefs.panel2,
        sectionRefs.panel4,
        sectionRefs.panel5,
      ];
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      sectionTopsRef.current = refsInOrder.map((r) =>
        r.current ? r.current.getBoundingClientRect().top + scrollTop : 0
      );
    };

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        
        // Panel 2's starting position
        const panel2Top = sectionTopsRef.current[1]; 
        // Panel 2's height (it's a pinned section, so its scroll height is defined by panel2-shell)
        const panel2Height = sectionRefs.panel2.current?.offsetHeight || 0;
    
        /**
         * TRIGGER LOGIC:
         * Show footer when the scroll position (y) plus the viewport height (vh) 
         * has passed the end of Panel 2.
         */
        const endOfPanel2 = panel2Top + panel2Height;
        setShowFooter(y + vh > endOfPanel2);
    
        // ... rest of your activePanel logic ...
        const mid = y + vh * 0.5;
        const tops = sectionTopsRef.current;
        if (!tops.length) return;
    
        let rawIdx = 0;
        for (let i = 0; i < tops.length; i++) {
          const top = tops[i];
          const next = tops[i + 1] ?? Infinity;
          if (mid >= top && mid < next) {
            rawIdx = i;
            break;
          }
        }
        setActivePanel(rawIdx);
      });
    };

    refreshPositions();
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', refreshPositions);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener?.('change', onMq);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', refreshPositions);
    };
  }, []);

  const scrollToEl = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-cyan-400/40 overflow-x-hidden">
      {/* Glassmorphism Right Navbar */}
      <AnimatePresence>
          <motion.nav
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            className='fixed right-6 top-1/2 -translate-y-1/2 z-50 
                    flex flex-col gap-6 p-4 rounded-full 
                    bg-white/5 backdrop-blur-md border border-white/10 
                    shadow-[0_0_20px_rgba(0,183,255,0.2)]'
          >
            {[
              { id: 0, label: 'Intro', ref: sectionRefs.panel0 },
              { id: 1, label: 'About', ref: sectionRefs.panel2 },
              { id: 2, label: 'Audience', ref: sectionRefs.panel4 },
              { id: 3, label: 'Collaborators', ref: sectionRefs.panel5 },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => scrollToEl(item.ref.current)}
                // className="group relative flex items-center justify-center"
                className="w-3 h-3 rounded-full bg-white/20 hover:bg-cyan-400 
                transition-all duration-300 hover:scale-150 
                hover:shadow-[0_0_10px_#22d3ee]"
              >
                <span
                  className={[
                    'block w-3 h-3 rounded-full transition-all',
                    activePanel === item.id ? 'bg-cyan-300 scale-125 shadow-[0_0_18px_rgba(34,211,238,0.65)]' : 'bg-white/40',
                  ].join(' ')}
                />
                <span className="pointer-events-none absolute right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-xs tracking-widest uppercase text-white/80 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </motion.nav>
      </AnimatePresence>

      {/* Main Content Sections */}
      <main className="relative z-10">
        
        {/* Panel 1: Video */}
        <section ref={sectionRefs.panel0} className="h-screen w-full relative overflow-hidden snap-start">
          <video 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={myVid} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/60" />
        </section>

        <div className="contact-shell relative">
          {/* Panel 2: one image that starts centered, then slides left (pinned/sticky) */}
          <section ref={sectionRefs.panel2} className="h-screen w-full relative bg-black snap-start overflow-hidden">
            <div className="flex items-center h-full w-full max-w-7xl mx-auto px-10 relative">
              
              {/* Image: Vertically centered via top-1/2 and y: -50% */}
              <motion.img
                src={panel2Img}
                alt="About Me"
                className="absolute w-full max-w-[420px] max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10 bg-black/40"
                style={{
                  left: isMdUp ? panel2ImgLeftMd : '50%',
                  x: isMdUp ? 0 : '-50%',
                  top: '50%',
                  y: '-50%', 
                }}
              />

              {/* Content: Two clean paragraphs */}
              <motion.div
                className="ml-auto w-full md:w-1/2 flex flex-col justify-center"
                style={{ 
                  opacity: panel2ContentOpacity,
                  x: panel2ContentX 
                }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
                <div className="space-y-6 text-white/80">
                  <p className="text-lg leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-base leading-relaxed text-white/60">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </motion.div>

            </div>
          </section>

          {/* Panel 4: Niche Audience */}
          <section
            ref={sectionRefs.panel4}
            className="h-screen snap-start"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold text-blue-400 mb-6"
              >
                Niche Audience
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 max-w-2xl"
                style={{ margin: '0 auto' }}
              >
                Some audience for a lifestyle youtube audience brands.
              </motion.p>
            </div>

          </section>

          {/* Panel 5: Collaborators */}
          <section
            ref={sectionRefs.panel5}
            className="h-screen snap-start pb-24" // Added padding-bottom so content isn't hidden by footer
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <div>
              <motion.h2 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-purple-400 mb-8"
              >
                Collaborators
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {['Some', 'Collaborators', 'Brand', 'Names'].map((brand, i) => (
                  <motion.span 
                    key={`${brand}-${i}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-2xl font-semibold text-gray-500 hover:text-white transition-colors cursor-default"
                  >
                    {brand}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>

          {/* Sticky Footer */}
          <AnimatePresence>
            {showFooter && (
              <motion.footer 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="contact-footer p-5 md:p-6 flex justify-between items-center px-6 md:px-10"
              >
                <span className="font-medium tracking-widest uppercase text-sm md:text-base">Contact Me</span>
                <div className="flex gap-6">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors"><Instagram size={24} /></a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors"><Youtube size={24} /></a>
                  <a href="mailto:hello@example.com" className="hover:text-cyan-300 transition-colors"><Mail size={24} /></a>
                </div>
              </motion.footer>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;