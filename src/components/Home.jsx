import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Ruler, 
  Box, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  MapPin, 
  Check, 
  WifiOff, 
  RefreshCw,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useSiteSettings } from '../lib/settingsStore';

const DEFAULT_CMS_DATA = [
  {
    id: 'hero-1',
    section_type: 'hero',
    title: 'Modern Duplex Architectural Layout',
    subtitle: 'Order 2D Plan @ ₹999',
    page_path: '2d',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-2',
    section_type: 'hero',
    title: 'Contemporary 3D Elevation & Facade',
    subtitle: 'Order 3D Elevation @ ₹2499',
    page_path: '3d',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  { id: 'tag-1', section_type: 'tag', title: 'Residential' },
  { id: 'tag-2', section_type: 'tag', title: 'Commercial' },
  { id: 'tag-3', section_type: 'tag', title: 'Luxury Villa' },
  { id: 'tag-4', section_type: 'tag', title: 'Duplex Plan' },
  { id: 'tag-5', section_type: 'tag', title: 'Farmhouse' },
  {
    id: 'util-1',
    section_type: 'utility',
    title: '2D Layout Plan',
    subtitle: 'Vaastu compliant planning & dimensions',
    page_path: '2d',
    icon_class: 'ruler'
  },
  {
    id: 'util-2',
    section_type: 'utility',
    title: '3D Elevation Design',
    subtitle: 'Photorealistic exterior facades & lighting',
    page_path: '3d',
    icon_class: 'box'
  },
  {
    id: 'lower-1',
    section_type: 'lower_block',
    title: 'Modern 40x50 Residential Blueprint',
    subtitle: '2,000 Sq.Ft • 3 BHK Luxury • East Facing',
    page_path: 'src/Project/project1.jsx',
    category_tag: 'Residential',
    location: 'Jaipur, Rajasthan',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lower-2',
    section_type: 'lower_block',
    title: 'Contemporary Glass Facade Villa',
    subtitle: '30x60 Sq.Ft • 4 BHK Luxury Duplex',
    page_path: '3d',
    category_tag: 'Luxury Villa',
    location: 'Ahmedabad, Gujarat',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lower-3',
    section_type: 'lower_block',
    title: 'Minimalist Commercial Plaza Plan',
    subtitle: '50x80 Sq.Ft • G+3 Multi-Tenant Commercial',
    page_path: '2d',
    category_tag: 'Commercial',
    location: 'Gurgaon, Delhi NCR',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
  }
];

function Home({ user, changeTab, setFormType, openTargetPage, handleHeroButtonClick }) {
  const { settings } = useSiteSettings();
  const [cmsData, setCmsData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Quick Interactive Mode (2D Layouts vs 3D Elevation)
  const [quickServiceTab, setQuickServiceTab] = useState('2d');

  useEffect(() => {
    fetchLiveHome();
  }, []);

  const fetchLiveHome = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase.from('ecore_home_cms').select('*');
      if (error) {
        console.warn("Supabase home CMS notice, using default showcase data:", error.message);
        setCmsData(DEFAULT_CMS_DATA);
        return;
      }
      
      if (data && data.length > 0) {
        setCmsData(data);
      } else {
        setCmsData(DEFAULT_CMS_DATA);
      }
    } catch (err) {
      console.warn("Error fetching homepage elements, using fallback showcase data:", err);
      setCmsData(DEFAULT_CMS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = cmsData.filter(i => i.section_type === 'hero');
  const dbTags = cmsData.filter(i => i.section_type === 'tag');
  const portfolioItems = cmsData.filter(i => i.section_type === 'lower_block');

  const categories = ["All", ...dbTags.map(t => t.title)];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroSlides]);

  const filteredItems = selectedTag === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category_tag === selectedTag);

  const handleAction = (pagePath) => {
    if (!pagePath || !pagePath.trim()) return;

    if (!user) {
      changeTab('profile');
      return;
    }

    const pathStr = pagePath.toLowerCase();
    if (pathStr === '2d' || pathStr === '3d') {
      changeTab('service');
      setFormType(pathStr);
    } else if (typeof openTargetPage === 'function') {
      openTargetPage(pagePath);
    }
  };

  // 1️⃣ LOADING SHIMMER STATE
  if (loading) {
    return (
      <div className="space-y-6 pb-24 animate-pulse w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-48 h-7 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="w-5/6 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="w-2/3 h-6 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="w-full sm:w-80 h-12 bg-orange-500/20 rounded-2xl" />
          </div>
          <div className="lg:col-span-5 h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  // 2️⃣ SERVER RECONNECT STATE
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
        <div className="w-16 h-16 bg-orange-500/10 text-[#ea580c] rounded-2xl flex items-center justify-center text-2xl border border-orange-500/30 animate-bounce">
          <WifiOff className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Studio Server Disconnected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">Unable to load live blueprints. Please reconnect below.</p>
        </div>
        <button 
          onClick={fetchLiveHome}
          className="px-6 py-3 bg-[#ea580c] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reconnect Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-14 pb-28 text-left w-full max-w-7xl mx-auto">
      
      {/* 🌟 HOSTINGER-GRADE EXPANSIVE HERO SECTION (Responsive 2-Column Desktop & Fluid Mobile) */}
      <section className="relative overflow-hidden pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: High-Impact Architectural Copy & CTA */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ea580c] dark:text-[#ff8c42] text-xs font-mono font-bold shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{settings.siteSlogan || 'Sketch Your Dream'} &bull; 100% Vaastu Verified &bull; 1,200+ Blueprints</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Architectural CAD Blueprints &amp; <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#f97316] bg-clip-text text-transparent">
                3D Elevation Facades
              </span>
            </h1>

            {/* Sub-headline Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Transform your raw plot into a government-compliant, Vaastu-optimized architectural plan. Get complete CAD floor blueprints in 24 hours and photorealistic 3D elevations.
            </p>

            {/* Dual Action Buttons (Mobile & Desktop Ergonomic) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={() => {
                  if (typeof handleHeroButtonClick === 'function') {
                    handleHeroButtonClick('2d');
                  } else {
                    handleAction('2d');
                  }
                }}
                className="py-3.5 px-6 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Ruler className="w-4 h-4" />
                <span>Book 2D Layout Plan @ ₹999</span>
              </button>

              <button
                onClick={() => {
                  if (typeof handleHeroButtonClick === 'function') {
                    handleHeroButtonClick('3d');
                  } else {
                    handleAction('3d');
                  }
                }}
                className="py-3.5 px-6 rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:border-[#ea580c] dark:hover:border-[#ff8c42] hover:text-[#ea580c] dark:hover:text-[#ff8c42] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Box className="w-4 h-4" />
                <span>Order 3D Elevation @ ₹2499</span>
              </button>
            </div>

            {/* Architectural Trust Points Strip */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">24-48h Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Govt Norms CAD</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Printable PDF</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Architectural Perspective Showcase (Carousel) */}
          <div className="lg:col-span-5">
            {heroSlides.length > 0 && (
              <div className="relative w-full h-[320px] sm:h-[370px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/15 shadow-2xl group perspective-1000">
                
                {/* Blueprint grid texture */}
                <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none z-10" />

                {/* Corner Technical CAD Tags */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE 3D CAD STUDIO</span>
                </div>

                <div className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-[#ff8c42]">
                  SLIDE {activeSlide + 1} / {heroSlides.length}
                </div>

                {/* Slides Render */}
                {heroSlides.map((slide, index) => {
                  const isCurrent = index === activeSlide;
                  return (
                    <div
                      key={slide.id || index}
                      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                        isCurrent 
                          ? 'opacity-100 translate-x-0 scale-100' 
                          : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
                      }`}
                    >
                      <img 
                        src={slide.image_url} 
                        alt={slide.title} 
                        className="w-full h-full object-cover brightness-[0.78] contrast-110 group-hover:scale-105 transition-transform duration-1000"
                      />

                      {/* Lighting Gradient Scrim Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-20" />

                      {/* Floating Content Card */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-30">
                        <span className="text-[10px] font-extrabold tracking-widest uppercase bg-[#ea580c] text-white px-2.5 py-0.5 rounded-md inline-block w-max shadow-sm mb-2">
                          VERIFIED BLUEPRINT
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3 drop-shadow-md">
                          {slide.title}
                        </h3>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAction(slide.page_path)}
                            className="flex-1 py-3 bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{slide.subtitle || "Order Blueprint"}</span>
                          </button>

                          <button
                            onClick={() => handleAction('src/Project/project1.jsx')}
                            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Inspect Specs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Progress Indicators */}
                {heroSlides.length > 1 && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-30">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeSlide === idx 
                            ? 'w-7 bg-[#ea580c] shadow-[0_0_8px_#ea580c]' 
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </section>

      {/* 🧭 QUICK SERVICE MATRIX TABS (Pinterest & Hostinger Modern Card Switcher) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] dark:text-[#ff8c42]">
              INSTANT ARCHITECTURAL MODULES
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Select Your Blueprint Service
            </h2>
          </div>

          {/* Quick Filter Pill Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold w-max">
            <button
              onClick={() => setQuickServiceTab('2d')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                quickServiceTab === '2d' 
                  ? 'bg-[#ea580c] text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2D Floor Plan
            </button>
            <button
              onClick={() => setQuickServiceTab('3d')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                quickServiceTab === '3d' 
                  ? 'bg-[#ea580c] text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3D Elevation Facade
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid based on Quick Service Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: 2D Blueprint Plan */}
          <div 
            onClick={() => {
              if (user) {
                changeTab('service');
                setFormType('2d');
              } else {
                changeTab('profile');
              }
            }}
            className={`p-6 rounded-3xl transition-all duration-300 card-3d-tilt cursor-pointer relative overflow-hidden border ${
              quickServiceTab === '2d' 
                ? 'border-[#ea580c] bg-orange-500/5 dark:bg-orange-500/10 shadow-lg shadow-orange-500/10' 
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-[#ea580c] flex items-center justify-center text-xl shadow-inner">
                <Ruler className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-extrabold text-[#ea580c] bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                ₹999 Fixed Fee
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">
              2D Vaastu Floor Layout Plan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Engineered room layouts, exact plot boundary sizing, door/window schedules, and Vaastu Shastra compliance for bedrooms, puja rooms, and kitchens.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-[#ea580c]">
              <span>CONFIGURE 2D PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: 3D Facade Elevation */}
          <div 
            onClick={() => {
              if (user) {
                changeTab('service');
                setFormType('3d');
              } else {
                changeTab('profile');
              }
            }}
            className={`p-6 rounded-3xl transition-all duration-300 card-3d-tilt cursor-pointer relative overflow-hidden border ${
              quickServiceTab === '3d' 
                ? 'border-[#ea580c] bg-orange-500/5 dark:bg-orange-500/10 shadow-lg shadow-orange-500/10' 
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center text-xl shadow-inner">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-extrabold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                ₹2499 Full Render
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">
              3D Architectural Facade &amp; Elevation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Modern exterior textures, luxury glasswork, warm night lighting, terrace designs, and ultra-realistic day &amp; night render previews.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-blue-500">
              <span>CONFIGURE 3D RENDER</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* 🏷️ HORIZONTAL CATEGORY TAGS */}
      {categories.length > 1 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Explore Blueprint Styles
            </span>
            <span className="text-xs font-mono text-[#ea580c]">
              {filteredItems.length} Designs
            </span>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar py-1">
            <div className="flex gap-2.5">
              {categories.map((cat) => {
                const isSelected = selectedTag === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedTag(cat)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-2xl transition-all duration-200 tactile-click whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white shadow-md shadow-orange-500/25' 
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-orange-500/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 🖼️ FEATURED BLUEPRINTS & PROJECTS (Responsive 1/2/3 Columns) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Blueprints &amp; Project Renders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Click any project to inspect architectural specifications &amp; order custom layouts
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center text-slate-400 text-xs">
            No designs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAction(item.page_path || item.type)}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 hover:border-[#ea580c] shadow-sm hover:shadow-xl transition-all duration-300 card-3d-tilt cursor-pointer flex flex-col justify-between"
              >
                {/* Image Showcase */}
                <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75" />

                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase bg-black/75 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-xl shadow-sm">
                    {item.category_tag}
                  </span>

                  {/* Location Badge */}
                  {item.location && (
                    <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-[#ff8c42] border border-orange-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>

                {/* Content Bar */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="overflow-hidden space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#ea580c] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 group-hover:bg-[#ea580c] group-hover:text-white text-[#ea580c] flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;
