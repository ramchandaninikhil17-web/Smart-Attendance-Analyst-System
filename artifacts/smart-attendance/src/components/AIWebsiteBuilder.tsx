import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Globe,
  Code2,
  Check,
  X,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

/**
 * 24x24px Sunburst SVG Icon in pure white color as specified
 */
export function SunburstIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <line x1="4.57" y1="4.57" x2="7.4" y2="7.4" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="16.6" y1="16.6" x2="19.43" y2="19.43" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="4.57" y1="19.43" x2="7.4" y2="16.6" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="16.6" y1="7.4" x2="19.43" y2="4.57" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Navbar Component
 * Exact specification:
 * - Fixed to top, full width, z-index 50
 * - Background: fully transparent (bg-transparent)
 * - Padding: px-6 py-4
 * - Flexbox layout: items-center justify-between
 * - Left Section: Sunburst icon (24x24px SVG) in white color
 * - Center Section (hidden on mobile, visible md:flex): "Products" (with ChevronDown icon), "Customer Stories", "Resources", "Pricing"
 * - Right Section: "Book A Demo" link (hidden on small screens, sm:block), "Get Started" button
 */
export function Navbar({
  onBookDemo,
  onGetStarted,
}: {
  onBookDemo?: () => void;
  onGetStarted?: () => void;
}) {
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

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <button
          onClick={onBookDemo}
          className="hidden sm:block font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none"
        >
          Book A Demo
        </button>
        <button
          onClick={onGetStarted}
          type="button"
          className="bg-white text-black rounded-full px-5 py-2.5 font-semibold text-sm hover:bg-neutral-200 transition-colors cursor-pointer focus:outline-none"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

/**
 * Complete AI Website Builder Website
 * Built 100% around the 3D animated hero section and prompt specifications.
 */
export function AIWebsiteBuilder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

  // Modal and Interactive states
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  // Exact HLS.js video streaming implementation
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

  const handleStartGeneration = (text?: string) => {
    const target = text || promptText || "Sleek dark mode SaaS for autonomous AI workers with pricing";
    setPromptText(target);
    setIsSimulating(true);
    setSimStep(0);

    const timer = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          return 3;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-600/30 font-['Instrument_Sans',sans-serif]">
      {/* ======================================================================= */}
      {/* 1. HERO SECTION (EXACT SPECIFICATION)                                  */}
      {/* ======================================================================= */}
      <section className="relative w-full min-h-screen bg-[#000000] text-white overflow-hidden flex flex-col justify-center items-center">
        {/* Navbar Component */}
        <Navbar
          onBookDemo={() => setShowDemoModal(true)}
          onGetStarted={() => handleStartGeneration()}
        />

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
              onClick={() => handleStartGeneration()}
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
              onClick={() => setShowExamplesModal(true)}
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
      </section>

      {/* ======================================================================= */}
      {/* 2. INTERACTIVE AI BUILDER DEMO PROMPT BAR                              */}
      {/* ======================================================================= */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 -mt-10 pb-20">
        <div className="p-2 rounded-2xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full pl-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 animate-pulse" />
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStartGeneration();
              }}
              placeholder="Prompt the AI builder: e.g. Minimalist architectural studio with dark gallery..."
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none py-2"
            />
          </div>
          <button
            onClick={() => handleStartGeneration()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-lg shadow-blue-600/30"
          >
            <span>Synthesize Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-white/40 font-medium">Quick Prompts:</span>
          {[
            "Fintech dashboard with dark glass charts",
            "Editorial fashion store with horizontal slider",
            "Autonomous AI agent startup landing page",
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleStartGeneration(prompt)}
              className="text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-3 py-1 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 3. PRODUCTS & CAPABILITIES                                              */}
      {/* ======================================================================= */}
      <section id="products" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p
            className="text-white text-3xl sm:text-4xl mb-3"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Engineered for pure speed and precision
          </p>
          <p className="text-white/70 text-base">
            From natural language prompts to production-grade React code and globally distributed edge deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-neutral-950 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Zero-Latency AI Engine</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Stream interactive layouts in real time. Our neural compiler synthesizes semantic HTML, CSS tokens, and Motion physics in under 2 seconds.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-blue-400 font-medium flex items-center gap-1">
              <span>Explore Compiler Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-950 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">3D Motion & Design System</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Native glassmorphism, dynamic HLS video streaming layers, screen blend modes, and curated typography out of the box.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-indigo-400 font-medium flex items-center gap-1">
              <span>View Design Tokens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-950 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Edge & SEO 100/100</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Automated schema markup, metadata tags, instant CDN cache invalidation, and sub-100ms first contentful paint worldwide.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span>Review Performance Benchmark</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 4. CUSTOMER STORIES / LIVE SHOWCASE                                     */}
      {/* ======================================================================= */}
      <section id="stories" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p
              className="text-white text-3xl sm:text-4xl mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Customer Stories & Real Creations
            </p>
            <p className="text-white/70 text-base">
              Explore live production websites launched with our AI website builder.
            </p>
          </div>
          <button
            onClick={() => setShowExamplesModal(true)}
            className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors self-start md:self-auto"
          >
            Browse All 140K+ Sites
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Nexus Neural OS",
              category: "AI SaaS Platform",
              desc: "Enterprise landing page with interactive terminal and live node topology.",
              image:
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
              score: "99/100 SEO",
            },
            {
              title: "Verve Atelier",
              category: "Luxury Architecture",
              desc: "Editorial typography with horizontal scroll and responsive masonry.",
              image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
              score: "100/100 Speed",
            },
            {
              title: "Krypton Pay",
              category: "Global Fintech",
              desc: "Dark glassmorphic layout with multi-currency chart widgets and security audit log.",
              image:
                "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
              score: "99/100 Best Practices",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                  {item.score}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-semibold text-white mt-1">{item.title}</h4>
                  <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleStartGeneration(item.title)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Build Similar Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 5. PRICING                                                              */}
      {/* ======================================================================= */}
      <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p
            className="text-white text-3xl sm:text-4xl mb-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Simple, transparent pricing
          </p>
          <p className="text-white/70 text-sm">
            Start building for free. Scale seamlessly with custom domain hosting and source code export.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-white text-base">Free Starter</h4>
              <div className="text-3xl font-bold text-white mt-2">$0</div>
              <p className="text-xs text-white/60 mt-1">For testing ideas & prototypes.</p>
              <ul className="text-xs text-white/80 space-y-2.5 mt-6">
                <li>• 3 AI Websites per month</li>
                <li>• Instant subdomain hosting</li>
                <li>• Standard neural compiler</li>
              </ul>
            </div>
            <button
              onClick={() => handleStartGeneration()}
              className="w-full mt-8 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Start Free
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-blue-600/10 border-2 border-blue-500 relative flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white uppercase tracking-wider">
              Popular
            </span>
            <div>
              <h4 className="font-semibold text-white text-base">Pro Builder</h4>
              <div className="text-3xl font-bold text-white mt-2">
                $24<span className="text-sm font-normal text-white/60">/mo</span>
              </div>
              <p className="text-xs text-white/60 mt-1">For founders & creators.</p>
              <ul className="text-xs text-white/80 space-y-2.5 mt-6">
                <li>• Unlimited AI site generation</li>
                <li>• Custom domains & free SSL</li>
                <li>• Clean React 19 source code export</li>
                <li>• Ultra-fast Mux 3D video streaming</li>
              </ul>
            </div>
            <button
              onClick={() => handleStartGeneration()}
              className="w-full mt-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-600/30"
            >
              Upgrade to Pro
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-white text-base">Agency Studio</h4>
              <div className="text-3xl font-bold text-white mt-2">
                $89<span className="text-sm font-normal text-white/60">/mo</span>
              </div>
              <p className="text-xs text-white/60 mt-1">For digital agencies & teams.</p>
              <ul className="text-xs text-white/80 space-y-2.5 mt-6">
                <li>• Unlimited team collaborators</li>
                <li>• White-label client portal</li>
                <li>• Dedicated high-priority GPU queue</li>
                <li>• 24/7 dedicated engineering SLA</li>
              </ul>
            </div>
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full mt-8 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Contact Team
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 6. RESOURCES & FOOTER                                                   */}
      {/* ======================================================================= */}
      <footer id="resources" className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <SunburstIcon className="w-6 h-6 text-white" />
            <span className="font-semibold text-white tracking-tight text-sm">
              Aether AI Website Builder
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-white/60">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#stories" className="hover:text-white transition-colors">Customer Stories</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-white transition-colors">Documentation</a>
            <button onClick={() => setShowDemoModal(true)} className="hover:text-white transition-colors">
              Book A Demo
            </button>
          </div>

          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} Aether AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ======================================================================= */}
      {/* AI GENERATION SIMULATOR MODAL                                           */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isSimulating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-neutral-950 border border-white/20 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsSimulating(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 text-blue-400 mb-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                <h3 className="font-semibold text-lg text-white">Synthesizing Website...</h3>
              </div>
              <p className="text-xs text-white/60 mb-6 truncate">
                Prompt: "{promptText}"
              </p>

              <div className="space-y-3.5">
                {[
                  "Deconstructing architecture and visual token palette",
                  "Synthesizing responsive React 19 + Tailwind v4 components",
                  "Embedding motion physics & micro-interactions",
                  "Generating edge deployment package with 100/100 Lighthouse score",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        simStep > idx
                          ? "bg-emerald-500 text-black"
                          : simStep === idx
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {simStep > idx ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        simStep >= idx ? "text-white font-medium" : "text-white/40"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {simStep === 3 && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Website Generated in 1.8s!</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsSimulating(false);
                      setShowExamplesModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    View Result
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* BOOK A DEMO MODAL                                                       */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-neutral-950 border border-white/20 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 text-blue-400 mb-1">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-white">Book A 1-on-1 Demo</h3>
              </div>
              <p className="text-xs text-white/60 mb-5">
                See how top agencies & founders build 10x faster with our AI website builder.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! Our solutions architect will contact you within 15 minutes.");
                  setShowDemoModal(false);
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Studio"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  Schedule Demo
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* SHOWCASE EXAMPLES MODAL                                                 */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {showExamplesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Showcase Gallery</h3>
                  <p className="text-xs text-white/60 mt-1">Live websites created with Aether AI in seconds.</p>
                </div>
                <button
                  onClick={() => setShowExamplesModal(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  {
                    title: "Nexus Neural OS",
                    category: "AI SaaS Platform",
                    desc: "Enterprise landing page with interactive terminal and live node topology.",
                    image:
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                    score: "99/100 SEO",
                  },
                  {
                    title: "Verve Atelier",
                    category: "Luxury Architecture",
                    desc: "Editorial typography with horizontal scroll and responsive masonry.",
                    image:
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                    score: "100/100 Speed",
                  },
                  {
                    title: "Krypton Pay",
                    category: "Global Fintech",
                    desc: "Dark glassmorphic layout with multi-currency chart widgets and security audit log.",
                    image:
                      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
                    score: "99/100 Best Practices",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                        {item.score}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                          {item.category}
                        </span>
                        <h4 className="text-base font-semibold text-white mt-0.5">{item.title}</h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowExamplesModal(false);
                          handleStartGeneration(item.title);
                        }}
                        className="mt-4 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Clone & Build This</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIWebsiteBuilder;
