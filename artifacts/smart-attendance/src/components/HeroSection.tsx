import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Hls from "hls.js";
import { ChevronDown, ArrowRight } from "lucide-react";

/**
 * 24x24px Sunburst SVG Icon in white color
 */
function SunburstIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sunburst Logo"
    >
      <circle cx="12" cy="12" r="3.75" fill="white" />
      <line x1="12" y1="1.5" x2="12" y2="5.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="12" y1="18.5" x2="12" y2="22.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="1.5" y1="12" x2="5.5" y2="12" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="18.5" y1="12" x2="22.5" y2="12" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Navbar Component as specified:
 * - Fixed to top, full width, z-index 50
 * - Background: fully transparent (bg-transparent)
 * - Padding: px-6 py-4
 * - Flexbox layout: items-center justify-between
 */
export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      {/* Left Section: Sunburst icon (24x24px SVG) in white color */}
      <div className="flex items-center">
        <a href="#" aria-label="Home" className="inline-flex items-center cursor-pointer">
          <SunburstIcon className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Center Section (hidden on mobile, visible md:flex) */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#products"
          className="flex items-center gap-1 font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <span>Products</span>
          <ChevronDown className="w-4 h-4 text-white/80" />
        </a>
        <a
          href="#stories"
          className="font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          Customer Stories
        </a>
        <a
          href="#resources"
          className="font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          Resources
        </a>
        <a
          href="#pricing"
          className="font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          Pricing
        </a>
      </div>

      {/* Right Section: Book A Demo (hidden sm:block) & Get Started button */}
      <div className="flex items-center gap-6">
        <a
          href="#demo"
          className="hidden sm:block font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          Book A Demo
        </a>
        <button
          type="button"
          className="bg-white text-black rounded-full px-5 py-2.5 font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

/**
 * Hero Section Component with 3D animated background video streaming,
 * exact typography, decorative gradients, and Motion animations.
 */
export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      const onLoadedMetadata = () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    }
    return undefined;
  }, [videoSrc]);

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-white overflow-hidden flex flex-col justify-center items-center">
      {/* Navbar Component */}
      <Navbar />

      {/* Background Video Layer */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        poster="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />

      {/* Video Overlay: bg-black/60 with backdrop-blur-[2px] */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none" />

      {/* Decorative Gradients */}
      {/* Top-left gradient: position top-[-20%] left-[20%], size 600x600px, bg-blue-900/20, blur-[120px], mix-blend-screen */}
      <div
        className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-900/20 blur-[120px] mix-blend-screen rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Bottom-right gradient: position bottom-[-10%] right-[20%], size 500x500px, bg-indigo-900/20, blur-[120px], mix-blend-screen */}
      <div
        className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-900/20 blur-[120px] mix-blend-screen rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Container: max-w-5xl, mx-auto, items-center, text-center, z-10, mt-20, space-y-12 */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-20 space-y-12 px-6">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-3xl sm:text-5xl lg:text-[48px] leading-[1.1]"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Design at the speed of thought
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-semibold text-6xl sm:text-8xl lg:text-[136px] leading-[0.9] tracking-tighter bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Build Faster
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white text-lg sm:text-[20px] leading-[1.65] max-w-xl"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Create fully functional, SEO-optimized websites in seconds with our advanced AI engine.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center"
        >
          {/* Primary Button */}
          <button
            type="button"
            className="group pl-6 pr-2 py-2 rounded-full bg-white flex items-center gap-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span
              className="font-medium text-lg text-[#0a0400]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Start Building Free
            </span>
            <div className="w-[40px] h-[40px] rounded-full bg-[#3054ff] hover:bg-[#2040e0] flex items-center justify-center transition-colors">
              <ArrowRight className="w-[20px] h-[20px] text-white" />
            </div>
          </button>

          {/* Secondary Button */}
          <button
            type="button"
            className="group px-4 py-2 rounded-lg text-white/70 hover:text-white backdrop-blur-sm hover:bg-white/5 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span
              className="text-base"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              See Examples
            </span>
            <ArrowRight className="w-[20px] h-[20px] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
