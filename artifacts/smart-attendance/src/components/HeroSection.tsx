import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Sliders,
  X,
  Check,
  Play,
  RotateCcw,
  Layers,
  Code2,
  Zap,
  Globe,
  Star,
  Calendar,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from "lucide-react";

/**
 * Content definition interface for rapid website content management.
 * Edit any field directly or customize via the on-screen Content Manager.
 */
export interface WebsiteContent {
  brandName: string;
  preHeadline: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  demoCta: string;
  getStartedCta: string;
  videoSrc: string;
  posterSrc: string;
  navLinks: {
    label: string;
    hasDropdown?: boolean;
    dropdownItems?: { title: string; desc: string; badge?: string }[];
  }[];
  quickPrompts: string[];
  stats: { value: string; label: string }[];
  features: { icon: string; title: string; desc: string }[];
  showcaseProjects: {
    title: string;
    category: string;
    desc: string;
    image: string;
    score: string;
  }[];
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  brandName: "Aether AI",
  preHeadline: "Design at the speed of thought",
  headline: "Build Faster",
  subheadline:
    "Create fully functional, SEO-optimized websites in seconds with our advanced AI engine.",
  primaryCta: "Start Building Free",
  secondaryCta: "See Examples",
  demoCta: "Book A Demo",
  getStartedCta: "Get Started",
  videoSrc:
    "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8",
  posterSrc:
    "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  navLinks: [
    {
      label: "Products",
      hasDropdown: true,
      dropdownItems: [
        {
          title: "AI Site Generator",
          desc: "Full-stack web applications synthesized from natural language prompts",
          badge: "v2.4",
        },
        {
          title: "Visual Styler & Themes",
          desc: "Glassmorphism, dark modes, dynamic typography & custom design tokens",
        },
        {
          title: "Autonomous Deployments",
          desc: "Instant edge distribution with custom SSL, DNS & high-speed caching",
        },
        {
          title: "Component Studio",
          desc: "Export to production React 19, Next.js, Vite & Tailwind CSS",
        },
      ],
    },
    { label: "Customer Stories" },
    { label: "Resources" },
    { label: "Pricing" },
  ],
  quickPrompts: [
    "Sleek dark-mode SaaS for autonomous AI dev teams with pricing table",
    "Minimalist architectural portfolio with interactive gallery & smooth curves",
    "High-converting fintech landing page with real-time currency converter",
  ],
  stats: [
    { value: "140K+", label: "Websites Generated" },
    { value: "1.8s", label: "Average Time-to-Deploy" },
    { value: "99.99%", label: "Edge Global Availability" },
    { value: "100/100", label: "Automated Lighthouse Score" },
  ],
  features: [
    {
      icon: "Zap",
      title: "Zero-Latency Synthesis",
      desc: "Stream interactive React code in real-time as your prompt resolves.",
    },
    {
      icon: "Layers",
      title: "Production Frameworks",
      desc: "Clean semantic HTML, modern Tailwind v4, and accessible Radix primitives.",
    },
    {
      icon: "Globe",
      title: "Global Edge SEO",
      desc: "Automated schema markup, OpenGraph cards, and sub-100ms Core Web Vitals.",
    },
  ],
  showcaseProjects: [
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
  ],
};

/**
 * 24x24px Sunburst SVG icon in pure white as specified.
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
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.75" fill="white" />
      <line x1="12" y1="1" x2="12" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="1" y1="12" x2="5" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="19" y1="12" x2="23" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface HeroSectionProps {
  content?: Partial<WebsiteContent>;
  onStartBuilding?: () => void;
  onSeeExamples?: () => void;
  onBookDemo?: () => void;
}

export function HeroSection({
  content: initialContent,
  onStartBuilding,
  onSeeExamples,
  onBookDemo,
}: HeroSectionProps) {
  // Merge customized props with default content
  const [content, setContent] = useState<WebsiteContent>({
    ...DEFAULT_WEBSITE_CONTENT,
    ...initialContent,
  });

  // HLS Video Reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = content.videoSrc;

  // Interactive UI state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCMS, setShowCMS] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isSimulatingBuild, setIsSimulatingBuild] = useState(false);
  const [buildStep, setBuildStep] = useState(0);

  // Exact HLS.js video implementation
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

  // Simulation handler for AI builder
  const handleTriggerBuild = (promptText?: string) => {
    const query = promptText || promptInput || content.quickPrompts[0];
    setPromptInput(query);
    setIsSimulatingBuild(true);
    setBuildStep(0);

    const stepsInterval = setInterval(() => {
      setBuildStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepsInterval);
          return 3;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#000000] text-white overflow-hidden flex flex-col justify-between selection:bg-blue-500/30 font-['Instrument_Sans',sans-serif]"
      style={{
        fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        poster={content.posterSrc}
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
        muted
        loop
        playsInline
        autoPlay
      />

      {/* Video Overlay: bg-black/60 with backdrop-blur-[2px] */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Decorative Gradients */}
      {/* Top-left gradient: top-[-20%] left-[20%], 600x600px, bg-blue-900/20, blur-[120px], mix-blend-screen */}
      <div
        className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-900/20 blur-[120px] mix-blend-screen rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* Bottom-right gradient: bottom-[-10%] right-[20%], 500x500px, bg-indigo-900/20, blur-[120px], mix-blend-screen */}
      <div
        className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-900/20 blur-[120px] mix-blend-screen rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* Navbar Component                                                          */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
        {/* Left Section: Sunburst icon (24x24px SVG) in white color */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="Home"
          >
            <SunburstIcon className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500 ease-out" />
            <span className="font-semibold text-white tracking-tight text-base font-['Instrument_Sans',sans-serif]">
              {content.brandName}
            </span>
          </button>
        </div>

        {/* Center Section: (hidden on mobile, visible md:flex) */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {content.navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <button
                onClick={() => {
                  if (link.hasDropdown) {
                    setActiveDropdown(activeDropdown === link.label ? null : link.label);
                  } else if (link.label === "Customer Stories") {
                    setShowExamplesModal(true);
                  } else if (link.label === "Pricing") {
                    setShowPricingModal(true);
                  } else if (link.label === "Resources") {
                    setShowExamplesModal(true);
                  }
                }}
                className="flex items-center gap-1.5 font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none"
              >
                <span>{link.label}</span>
                {link.hasDropdown && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === link.label ? "rotate-180 text-white" : "text-white/60"
                    }`}
                  />
                )}
              </button>

              {/* Products Dropdown Menu */}
              {link.hasDropdown && activeDropdown === link.label && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 p-3 rounded-2xl bg-neutral-950/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/40 px-3 py-1 mb-1">
                    AI Creation Suite
                  </div>
                  <div className="space-y-1">
                    {link.dropdownItems?.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setActiveDropdown(null);
                          handleTriggerBuild(item.title);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors group flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/60 line-clamp-2">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section: Book A Demo link (hidden on small screens, sm:block) & Get Started button */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (onBookDemo) onBookDemo();
              else setShowDemoModal(true);
            }}
            className="hidden sm:block font-['Instrument_Sans',sans-serif] text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            {content.demoCta}
          </button>

          <button
            onClick={() => {
              if (onStartBuilding) onStartBuilding();
              else handleTriggerBuild();
            }}
            className="bg-white text-black rounded-full px-5 py-2.5 font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-md shadow-white/10 cursor-pointer focus:outline-none"
          >
            {content.getStartedCta}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* Hero Section Component Main Content                                       */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col items-center text-center mt-28 sm:mt-32 md:mt-36 space-y-12">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-3xl sm:text-5xl lg:text-[48px] leading-[1.1] tracking-normal"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          {content.preHeadline}
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-semibold text-6xl sm:text-8xl lg:text-[136px] leading-[0.9] tracking-tighter bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent select-none"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          {content.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white text-lg sm:text-[20px] leading-[1.65] max-w-xl mx-auto font-normal"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          {content.subheadline}
        </motion.p>

        {/* CTA Buttons Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 items-center justify-center pt-2"
        >
          {/* Primary Button */}
          <button
            onClick={() => {
              if (onStartBuilding) onStartBuilding();
              else handleTriggerBuild();
            }}
            className="group pl-6 pr-2 py-2 rounded-full bg-white flex items-center gap-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
            aria-label={content.primaryCta}
          >
            <span
              className="font-medium text-lg text-[#0a0400]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              {content.primaryCta}
            </span>
            <div className="w-10 h-10 rounded-full bg-[#3054ff] hover:bg-[#2040e0] flex items-center justify-center transition-colors shadow-sm">
              <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => {
              if (onSeeExamples) onSeeExamples();
              else setShowExamplesModal(true);
            }}
            className="group px-4 py-2 rounded-lg text-white/70 hover:text-white backdrop-blur-sm hover:bg-white/5 flex items-center gap-2 transition-all cursor-pointer text-base font-medium"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            aria-label={content.secondaryCta}
          >
            <span>{content.secondaryCta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Interactive AI Website Generator Prompt Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full max-w-2xl mx-auto pt-4"
        >
          <div className="relative p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-2 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="pl-3 text-blue-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTriggerBuild();
              }}
              placeholder="Describe your dream website (e.g. Modern dark AI studio with pricing)..."
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none py-2 font-['Instrument_Sans',sans-serif]"
            />
            <button
              onClick={() => handleTriggerBuild()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-lg shadow-blue-600/30"
            >
              <span>Generate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
              Try:
            </span>
            {content.quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleTriggerBuild(prompt)}
                className="text-xs text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-full px-3 py-1 transition-all truncate max-w-xs text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Trust & Live Performance Bar */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 mt-16 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Instrument_Sans',sans-serif]">
                {stat.value}
              </span>
              <span className="text-xs text-white/60 mt-1 uppercase tracking-wider font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* Floating Content Manager Controller (Rapid Website Management)             */}
      {/* ========================================================================= */}
      <aside aria-label="Website Content Manager Controls" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowCMS(!showCMS)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-medium border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 cursor-pointer"
          title="Open Content Manager to edit all website texts in real-time"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Manage Content</span>
        </button>
      </aside>

      {/* Content Management Drawer */}
      <AnimatePresence>
        {showCMS && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-neutral-950/95 border-l border-white/15 backdrop-blur-2xl z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                  Website Content Manager
                </h2>
              </div>
              <button
                onClick={() => setShowCMS(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 mt-3">
              Fast live content editor: Modify your headlines, subtext, button labels, and streaming video parameters with instant live preview.
            </p>

            <div className="space-y-4 mt-6 flex-1">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={content.brandName}
                  onChange={(e) => setContent({ ...content, brandName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Pre-Headline (Instrument Serif)
                </label>
                <input
                  type="text"
                  value={content.preHeadline}
                  onChange={(e) => setContent({ ...content, preHeadline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Main Headline (Build Faster)
                </label>
                <input
                  type="text"
                  value={content.headline}
                  onChange={(e) => setContent({ ...content, headline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Subheadline
                </label>
                <textarea
                  rows={3}
                  value={content.subheadline}
                  onChange={(e) => setContent({ ...content, subheadline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={content.primaryCta}
                    onChange={(e) => setContent({ ...content, primaryCta: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    value={content.secondaryCta}
                    onChange={(e) => setContent({ ...content, secondaryCta: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">
                  Mux HLS Video Stream URL (.m3u8)
                </label>
                <input
                  type="text"
                  value={content.videoSrc}
                  onChange={(e) => setContent({ ...content, videoSrc: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 truncate"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  onClick={() => setContent(DEFAULT_WEBSITE_CONTENT)}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Exact Specs</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(content, null, 2));
                    alert("Content JSON copied to clipboard!");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Export Content
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Interactive AI Build Simulator Modal                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSimulatingBuild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-neutral-950 border border-white/20 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsSimulatingBuild(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 text-blue-400 mb-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                <h3 className="font-semibold text-lg text-white">
                  Aether AI Engine Working...
                </h3>
              </div>
              <p className="text-xs text-white/60 mb-6">
                Prompt: "{promptInput || content.quickPrompts[0]}"
              </p>

              {/* Progress Steps */}
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
                        buildStep > idx
                          ? "bg-emerald-500 text-black"
                          : buildStep === idx
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {buildStep > idx ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        buildStep >= idx ? "text-white font-medium" : "text-white/40"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {buildStep === 3 && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Website Generated in 1.8s! Ready to deploy.</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsSimulatingBuild(false);
                      setShowExamplesModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    View Result
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Interactive Examples / Customer Stories Showcase Modal                     */}
      {/* ========================================================================= */}
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
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    AI-Built Websites Showcase
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Explore live production sites created by founders using Aether AI in seconds.
                  </p>
                </div>
                <button
                  onClick={() => setShowExamplesModal(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {content.showcaseProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                        {project.score}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                          {project.category}
                        </span>
                        <h4 className="text-base font-semibold text-white mt-0.5">
                          {project.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {project.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowExamplesModal(false);
                          handleTriggerBuild(project.title);
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

      {/* ========================================================================= */}
      {/* Interactive Book A Demo Modal                                             */}
      {/* ========================================================================= */}
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
                See how top agencies & enterprises build 10x faster with our AI website generator.
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
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Inc."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1">
                    Expected Websites Per Month
                  </label>
                  <select className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option>1 - 5 websites</option>
                    <option>5 - 25 websites</option>
                    <option>25+ websites (Agency / Enterprise)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  Confirm Live Demo
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* Interactive Pricing Modal                                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-neutral-950 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center max-w-md mx-auto mb-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Transparent, Predictable Pricing
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Start building completely free. Upgrade whenever your team needs custom code export and priority edge hosting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">Free Starter</h4>
                    <div className="text-2xl font-bold text-white mt-2">$0</div>
                    <p className="text-xs text-white/60 mt-1">For hobbyists and quick prototypes.</p>
                    <ul className="text-xs text-white/80 space-y-2 mt-4">
                      <li>• 3 AI Websites / month</li>
                      <li>• Aether subdomain hosting</li>
                      <li>• Standard AI synthesis</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      handleTriggerBuild();
                    }}
                    className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Start Free
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-blue-600/10 border-2 border-blue-500 relative flex flex-col justify-between">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white uppercase tracking-wider">
                    Most Popular
                  </span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Pro Builder</h4>
                    <div className="text-2xl font-bold text-white mt-2">
                      $24<span className="text-xs font-normal text-white/60">/mo</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">For freelancers & modern founders.</p>
                    <ul className="text-xs text-white/80 space-y-2 mt-4">
                      <li>• Unlimited AI site generations</li>
                      <li>• Custom domains & free SSL</li>
                      <li>• Export clean React 19 source code</li>
                      <li>• Ultra-fast Mux video backgrounds</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      handleTriggerBuild();
                    }}
                    className="w-full mt-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-600/30"
                  >
                    Upgrade to Pro
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">Agency Studio</h4>
                    <div className="text-2xl font-bold text-white mt-2">
                      $89<span className="text-xs font-normal text-white/60">/mo</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">For digital agencies & scale-ups.</p>
                    <ul className="text-xs text-white/80 space-y-2 mt-4">
                      <li>• Unlimited team seats</li>
                      <li>• White-label client portal</li>
                      <li>• Dedicated GPU cluster queue</li>
                      <li>• 24/7 Priority SLA support</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      setShowDemoModal(true);
                    }}
                    className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Contact Team
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroSection;
