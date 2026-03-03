import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaRegEnvelope,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // The updated 'X' logo
// import myVid from './assets/test_vid.mp4';
import logo_intro from "./assets/Logo intro.mp4";
// import panel2Img from './assets/WhatsApp Image 2026-02-17 at 15.26.45.jpeg';
import r_pic from "./assets/RxD.jpeg";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";

const App = () => {
  // 1. DEFINE REFS FIRST
  const sectionRefs = {
    panel0: useRef(null),
    panel2: useRef(null),
    panel4: useRef(null),
    // panel5: useRef(null),
  };
  const videoRef = useRef(null);
  const sectionTopsRef = useRef([]);

  // 2. DEFINE MOTION VALUES
  const internalProgress = useMotionValue(0);

  // 3. DEFINE STATE
  // active panel index: 0=video, 1=panel2, 2=niche, 3=collaborators
  const [activePanel, setActivePanel] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  // 1. Get window width (you can use a hook or just window.innerWidth)
  const [width, setWidth] = useState(window.innerWidth);
  // NEW: Detect if we should use the vertical stacked layout
  const [isStacked, setIsStacked] = useState(false);

  // 4. NOW YOU CAN USE THEM IN UEEFFECTS
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // This will now work because internalProgress is defined above!
    internalProgress.set(0);
  }, []);
  useEffect(() => {
    // 1. Manually trigger scroll to top on mount
    window.scrollTo(0, 0);

    // 2. Prevent the browser from trying to restore previous scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 3. Reset your internal progress if needed
    internalProgress.set(0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWidth(w);
      // Stack if width < 1100px OR if it's portrait orientation (iPad Pro)
      setIsStacked(w < 1100 || h > w);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update your transforms to use isStacked instead of just isMobile&
  // Keep your existing horizontal transforms for Desktop
  const panel2ImgLeft = useTransform(
    internalProgress,
    [0, 0.5, 1],
    isStacked ? ["50%", "50%", "50%"] : ["50%", "25%", "25%"],
  );

  // Add a vertical lift for stacked layouts
  const stackedGroupY = useTransform(
    internalProgress,
    [0, 0.5, 1],
    isStacked ? ["0%", "-15%", "-15%"] : ["0%", "0%", "0%"],
  );

  const { scrollYProgress: panel2Progress } = useScroll({
    target: sectionRefs.panel2,
    // Drive strictly while scrolling within Panel 2 (keeps image at 30rem on entry).
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (activePanel === 1) {
        const current = internalProgress.get();

        // If scrolling down and not finished
        if (e.deltaY > 0 && current < 1) {
          e.preventDefault();
          setIsLocked(true);
          internalProgress.set(Math.min(current + 0.04, 1));
        }
        // If scrolling up and not back at start
        else if (e.deltaY < 0 && current > 0) {
          e.preventDefault();
          setIsLocked(true);
          internalProgress.set(Math.max(current - 0.04, 0));
        } else {
          setIsLocked(false);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activePanel, internalProgress]);

  // Lock body scroll when internal animation is happening
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLocked]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Define the dynamic transforms
  // Desktop (> 1280px): Start further right, dock at 20rem
  // Laptop (1024px - 1280px): Start at 50%, dock at 15rem
  // Tablet (< 1024px): Start at 50%, dock at 5rem (or center)

  const getImgLeftRange = () => {
    if (width >= 1440) return ["60%", "20rem", "20rem"]; // Large Desktop
    if (width >= 1024) return ["50%", "15rem", "15rem"]; // Laptop/Tablet Landscape
    return ["50%", "18rem", "18rem"]; // Tablet Portrait (your current "good" look)
  };

  // const panel2ImgLeftResponsive = useTransform(internalProgress, [0, 0.5, 1], getImgLeftRange());
  // This moves from Center (50%) to the Left (25%)
  // const panel2ImgLeft = useTransform(internalProgress, [0, 0.5, 1], ['50%', '25%', '25%']);

  // TRANSFORMS - Now using the internalProgress motion value
  // const panel2ImgLeft = useTransform(internalProgress, [0, 0.5, 1], ['50%', '18rem', '18rem']);
  // const panel2ImgLeftMd = useTransform(internalProgress, [0, 0.5, 1], ['30rem', '18rem', '18rem']);
  // const panel2ContentOpacity = useTransform(internalProgress, [0, 0.5, 0.8], [0, 0, 1]);
  const panel2ContentX = useTransform(
    internalProgress,
    [0, 0.5, 0.8],
    ["2rem", "2rem", "0rem"],
  );

  // // Detect if mobile (standard breakpoint 768px)
  // const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // // HORIZONTAL MOVE (Desktop/Tablet)
  // const panel2ImgLeft = useTransform(
  //   internalProgress,
  //   [0, 0.5, 1],
  //   isMobile ? ['50%', '50%', '50%'] : ['50%', '25%', '25%']
  // );

  // // VERTICAL MOVE (Mobile Only)
  // const panel2ImgTop = useTransform(
  //   internalProgress,
  //   [0, 0.5, 1],
  //   isMobile ? ['50%', '25%', '25%'] : ['50%', '50%', '50%']
  // );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // This moves the entire group (Image + Text) up on mobile
  const mobileGroupY = useTransform(
    internalProgress,
    [0, 0.5, 1],
    ["0%", "-20%", "-20%"],
  );

  const panel2ContentOpacity = useTransform(
    internalProgress,
    [0, 0.5, 0.8],
    [0, 0, 1],
  );

  // CONTENT SLIDE (Mobile slides up, Desktop slides left)
  const panel2ContentY = useTransform(
    internalProgress,
    [0, 0.5, 0.8],
    ["2rem", "2rem", "0rem"],
  );
  // const panel2ImgScale = useTransform(panel2Progress, [0, 0.8, 1], [1, 1, 0.95]);

  // const panel2ImgScale = useTransform(panel2Progress, [0, 0.35, 1], [1, 1, 0.985]);
  // Content should start showing when image reaches 20rem, and be fully visible
  // well before the pin releases. With left = 30 - 25*progress, left=20rem at 0.4.
  // const panel2ContentOpacity = useTransform(panel2Progress, [0, 0.4, 0.4], [0, 0, 1]);
  // const panel2ContentX = useTransform(panel2Progress, [0, 0.4, 0.4], ['2rem', '2rem', '0rem']);

  useEffect(() => {
    const refreshPositions = () => {
      const refsInOrder = [
        sectionRefs.panel0,
        sectionRefs.panel2,
        sectionRefs.panel4,
        // sectionRefs.panel5,
      ];
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      sectionTopsRef.current = refsInOrder.map((r) =>
        r.current ? r.current.getBoundingClientRect().top + scrollTop : 0,
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", refreshPositions);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", refreshPositions);
    };
  }, []);

  const scrollToEl = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };
  // useEffect(() => {
  //   const enableAudio = () => {
  //     if (videoRef.current) {
  //       videoRef.current.muted = false;
  //       videoRef.current.play().catch(err => console.log("Audio play blocked:", err));
  //     }
  //     // Remove listeners after first interaction
  //     window.removeEventListener('click', enableAudio);
  //     window.removeEventListener('touchstart', enableAudio);
  //   };

  //   window.addEventListener('click', enableAudio);
  //   window.addEventListener('touchstart', enableAudio);

  //   return () => {
  //     window.removeEventListener('click', enableAudio);
  //     window.removeEventListener('touchstart', enableAudio);
  //   };
  // }, []);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-cyan-400/40 overflow-x-hidden relative">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        {/* Glassmorphism Right Navbar */}
        <AnimatePresence>
          <motion.nav
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 
                    flex flex-col gap-4 md:gap-6 p-3 md:p-4 rounded-full 
                    bg-white/5 backdrop-blur-md border border-white/10 
                    shadow-[0_0_20px_rgba(0,183,255,0.2)]"
          >
            {[
              { id: 0, label: "Intro", ref: sectionRefs.panel0 },
              { id: 1, label: "About", ref: sectionRefs.panel2 },
              { id: 2, label: "Audience", ref: sectionRefs.panel4 },
              // { id: 3, label: 'Collaborators', ref: sectionRefs.panel5 },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => scrollToEl(item.ref.current)}
                className="group relative flex items-center justify-center w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/20 hover:bg-cyan-400 
                transition-all duration-300 hover:scale-150 
                hover:shadow-[0_0_10px_#22d3ee]"
              >
                <span
                  className={[
                    "block w-full h-full rounded-full transition-all",
                    activePanel === item.id
                      ? "bg-cyan-300 scale-125 shadow-[0_0_18px_rgba(34,211,238,0.65)]"
                      : "bg-white/40",
                  ].join(" ")}
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
          {/* <section ref={sectionRefs.panel0} className="h-screen w-full relative overflow-hidden snap-start">
          <video 
            ref={videoRef} autoPlay muted loop playsInline 
            className="absolute inset-0 w-full h-full object-cover"
            // onClick={() => {
            //   if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
            // }}
          >
            <source src={logo_intro} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/60" />
        </section> */}
          {/* Panel 1: Video */}

          {/* <section
          ref={sectionRefs.panel0}
          className="h-screen w-full relative overflow-hidden snap-start"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted // Keep as default for autoplay safety
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={logo_intro} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/60" /> */}

          {/* Glassmorphic Audio Toggle */}
          {/* <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="absolute bottom-10 right-10 z-20 flex items-center gap-3 px-5 py-3 
                      rounded-full bg-white/5 backdrop-blur-md border border-white/10 
                      shadow-[0_0_20px_rgba(0,183,255,0.1)] hover:border-cyan-400/50 transition-colors"
          > */}
          {/* <span className="text-xs tracking-[0.2em] uppercase font-light text-white/70">
              {isMuted ? "Sound Off" : "Sound On"}
            </span> */}
          {/* <div className="text-cyan-400">
              {isMuted ? (
                <IoVolumeMuteOutline size={20} />
              ) : (
                <IoVolumeHighOutline size={20} />
              )}
            </div>
          </motion.button>
        </section> */}
          <section
            ref={sectionRefs.panel0}
            className="h-screen w-full relative overflow-hidden snap-start flex items-center justify-center bg-black"
          >
            {/* Dynamic Background Glow for Mobile */}
            <div className="absolute inset-0 z-0 md:hidden bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15)_0%,_transparent_70%)]" />

            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              // Improved responsive sizing for iPad/Mobile
              className={`relative z-10 w-full ${isStacked ? "max-h-[60vh] object-contain scale-90" : "h-full object-cover"}`}
            >
              <source src={logo_intro} type="video/mp4" />
            </video>
            {/* Overlay Gradients */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* Glassmorphic Audio Toggle */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="absolute bottom-10 right-10 z-20 flex items-center gap-3 px-5 py-3 
                      rounded-full bg-white/5 backdrop-blur-md border border-white/10 
                      shadow-[0_0_20px_rgba(0,183,255,0.1)] hover:border-cyan-400/50 transition-colors"
            >
              {/* <span className="text-xs tracking-[0.2em] uppercase font-light text-white/70">
              {isMuted ? "Sound Off" : "Sound On"}
            </span> */}
              <div className="text-cyan-400">
                {isMuted ? (
                  <IoVolumeMuteOutline size={20} />
                ) : (
                  <IoVolumeHighOutline size={20} />
                )}
              </div>
            </motion.button>
          </section>

          <div className="contact-shell relative">
            {/* Panel 2: one image that starts centered, then slides left (pinned/sticky) */}

            {/* <section ref={sectionRefs.panel2} className="h-screen w-full relative bg-black snap-start overflow-hidden">
            <div className="flex flex-col md:flex-row items-center h-full w-full max-w-7xl mx-auto px-6 md:px-10 relative">
               */}
            {/* Image: Vertically centered via top-1/2 and y: -50% */}
            {/* <motion.img
                src={r_pic}
                alt="About Me"
                className="absolute w-full max-w-[300px] md:max-w-[420px] max-h-[70vh] object-contain"
                // className="absolute w-full max-w-[420px] max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10 bg-black/40"
                style={{
                  left: panel2ImgLeft,
                  x: '-50%',
                  top: '50%',
                  y: '-50%',
                }}
              /> */}

            {/* Content: Two clean paragraphs */}
            {/* <motion.div
                className="w-full md:w-1/2 ml-auto flex flex-col justify-center"
                style={{ 
                  opacity: panel2ContentOpacity,
                  x: panel2ContentX, 
                  paddingLeft: '10px'
                }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-center md:text-left">About Me</h2>
                <div className="space-y-4 md:space-y-6 text-white/80">
                  <p className="text-base md:text-lg leading-relaxed text-center md:text-left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/60 text-center md:text-left">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </motion.div>

            </div>
          </section> */}
            <section
              ref={sectionRefs.panel2}
              className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center"
            >
              <motion.div
                // Dynamic layout: column for Mobile/iPad Pro, row for Desktop
                className={`flex flex-col ${isStacked ? "items-center text-center" : "md:flex-row items-center"} w-full max-w-7xl mx-auto px-6 md:px-10`}
                style={{
                  y: isStacked ? stackedGroupY : 0,
                }}
              >
                <motion.img
                  src={r_pic}
                  alt="About Me"
                  // Image behaves as part of the flow in stacked layout, absolute in desktop
                  className={`rounded-2xl object-contain shadow-2xl ${
                    isStacked
                      ? "w-[70%] max-w-[400px] mb-8"
                      : "absolute w-full max-w-[420px]"
                  }`}
                  style={{
                    position: isStacked ? "relative" : "absolute",
                    left: isStacked ? "auto" : panel2ImgLeft,
                    x: isStacked ? 0 : "-50%",
                    top: isStacked ? "auto" : "50%",
                    y: isStacked ? 0 : "-50%",
                    maskImage: isStacked
                      ? "linear-gradient(to bottom, black 80%, transparent 100%)"
                      : "none",
                    WebkitMaskImage: isStacked
                      ? "linear-gradient(to bottom, black 80%, transparent 100%)"
                      : "none",
                  }}
                />

                <motion.div
                  className={`${isStacked ? "w-full" : "w-1/2 ml-auto"}`}
                  style={{
                    opacity: panel2ContentOpacity,
                    x: isStacked ? 0 : panel2ContentX,
                  }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    About Me
                  </h2>

                  {isStacked && (
                    <div className="w-16 h-[1px] bg-cyan-500/50 mx-auto mb-6" />
                  )}

                  <div
                    className={`space-y-4 text-white/70 ${isStacked ? "px-4" : ""}`}
                  >
                    <p className="text-lg md:text-xl leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </section>
            {/* <section
              ref={sectionRefs.panel2}
              className="h-screen w-full relative bg-black overflow-hidden flex items-center justify-center"
            > */}
            {/* The Main Container: Responsive Layout */}
            {/* <motion.div
                className="flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto px-6"
                style={{
                  y: isMobile ? mobileGroupY : 0, // Lift the whole group on mobile
                }}
              > */}
            {/* 1. The Image */}
            {/* <motion.img
                src={r_pic}
                alt="About Me"
                className="w-full max-w-[280px] md:max-w-[420px] max-h-[45vh] md:max-h-[70vh] object-contain rounded-2xl"
                style={{
                }}
              /> */}
            {/* <motion.img
                  src={r_pic}
                  className="w-full max-w-[280px] object-contain"
                  style={{
                    // Desktop Logic: Absolute slide to left
                    // Mobile Logic: Static in the flex column
                    position: isMobile ? "relative" : "absolute",
                    left: isMobile ? "auto" : panel2ImgLeft,
                    x: isMobile ? 0 : "-50%",
                    top: isMobile ? "auto" : "50%",
                    y: isMobile ? 0 : "-50%",
                    maskImage: isMobile
                      ? "linear-gradient(to bottom, black 80%, transparent 100%)"
                      : "none",
                    WebkitMaskImage: isMobile
                      ? "linear-gradient(to bottom, black 80%, transparent 100%)"
                      : "none",
                  }}
                /> */}

            {/* 2. The Content Wrapper */}
            {/* <motion.div
                  className="w-full md:w-1/2 md:ml-auto flex flex-col justify-center"
                  style={{
                    opacity: panel2ContentOpacity,
                    // Use a responsive gap instead of 10px
                    marginTop: isMobile ? "4vh" : "0",
                    x: isMobile ? 0 : panel2ContentX,
                  }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 text-center md:text-left">
                    About Me
                  </h2> */}

            {/* Add a subtle top border or accent line to "anchor" the text */}
            {/* {isMobile && (
                    <div className="w-12 h-[1px] bg-cyan-500/50 mx-auto mb-4" />
                  )}

                  <div className="space-y-4 text-white/70 text-center md:text-left">
                    <p className="text-base leading-relaxed">
                      Lorem ipsum dolor sit amet...
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </section> */}

            {/* Panel 4: Niche Audience */}
            <section
              ref={sectionRefs.panel4}
              className="h-screen snap-start flex items-center justify-center text-center px-6"
            >
              <div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-5xl font-bold text-blue-400 mb-6"
                >
                  Niche Audience
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                >
                  Some audience for a lifestyle youtube audience brands.
                </motion.p>
              </div>
            </section>

            {/* Panel 5: Collaborators */}
            {/* <section
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
          </section> */}

            {/* Sticky Footer */}
            <AnimatePresence>
              {showFooter && (
                <motion.footer
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="contact-footer p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-6 md:px-10"
                >
                  <span className="font-medium tracking-widest uppercase text-xs md:text-base text-center md:text-left">
                    Contact Me
                  </span>
                  <div className="flex gap-5 md:gap-6">
                    <a
                      href="https://x.com/r_xtremedigital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <FaXTwitter size={20} />
                    </a>
                    <a
                      href="https://www.youtube.com/@r.xtreme.digital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-red-600 transition-colors"
                    >
                      <FaYoutube size={20} />
                    </a>
                    <a
                      href="mailto:r.xtreme.digital@gmail.com"
                      className="hover:text-cyan-300 transition-colors"
                    >
                      <FaRegEnvelope size={20} />
                    </a>
                    <a
                      href="https://www.instagram.com/r.xtreme.digital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-400 transition-colors"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                      href="https://www.facebook.com/r.xtreme.digital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <FaFacebook size={20} />
                    </a>
                  </div>
                </motion.footer>
              )}
            </AnimatePresence>
          </div>
        </main>
      </motion.main>
    </div>
  );
};

export default App;
