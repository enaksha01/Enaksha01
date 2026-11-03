import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  { id: 'tag-4', section_type: 'tag', title: 'Duplex' },
  {
    id: 'util-1',
    section_type: 'utility',
    title: '2D Layout Plan',
    subtitle: 'Vaastu compliant planning',
    page_path: '2d',
    icon_class: 'fa-ruler-combined'
  },
  {
    id: 'util-2',
    section_type: 'utility',
    title: '3D Elevation Design',
    subtitle: 'Realistic exterior renders',
    page_path: '3d',
    icon_class: 'fa-cube'
  },
  {
    id: 'lower-1',
    section_type: 'lower_block',
    title: 'Modern 40x50 Residential Blueprint',
    subtitle: '2,000 Sq.Ft • 3 BHK Luxury • East Facing',
    page_path: 'src/Project/project1.jsx',
    category_tag: 'Residential',
    location: 'Jaipur',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lower-2',
    section_type: 'lower_block',
    title: 'Contemporary Glass Facade Villa',
    subtitle: '30x60 Sq.Ft • 4 BHK Luxury Duplex',
    page_path: '3d',
    category_tag: 'Luxury Villa',
    location: 'Ahmedabad',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lower-3',
    section_type: 'lower_block',
    title: 'Minimalist Commercial Complex Plan',
    subtitle: '50x80 Sq.Ft • G+3 Multi-Tenant Plaza',
    page_path: '2d',
    category_tag: 'Commercial',
    location: 'Delhi NCR',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
  }
];

function Home({ user, changeTab, setFormType, openTargetPage, handleHeroButtonClick }) {
  const [cmsData, setCmsData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 3D Spatial Teaser Mode state (2D floor vs 3D elevation wireframe)
  const [spatialMode, setSpatialMode] = useState('3d');

  useEffect(() => {
    fetchLiveHome();
  }, []);

  const fetchLiveHome = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase.from('ecore_home_cms').select('*');
      if (error) {
        console.warn("Supabase home CMS fetch notice, falling back to showcase data:", error.message);
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

  // Pure Admin Panel Data Filters
  const heroSlides = cmsData.filter(i => i.section_type === 'hero');
  const dbTags = cmsData.filter(i => i.section_type === 'tag');
  const dbUtilities = cmsData.filter(i => i.section_type === 'utility');
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

  // Centralized Navigation Handler (Intact Gating & Tab Logic)
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

  // 1️⃣ LOADING SHIMMER STATE (3D Blueprint Matrix Theme)
  if (loading) {
    return (
      <div className="space-y-6 pb-24 animate-pulse max-w-md md:max-w-xl mx-auto">
        <div className="relative w-full h-64 rounded-3xl bg-slate-900/80 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-30" />
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="w-28 h-5 bg-slate-800 rounded-full" />
            <div className="w-4/5 h-8 bg-slate-800 rounded-xl" />
            <div className="w-full h-11 bg-[#eb6923]/20 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          <div className="w-20 h-9 bg-slate-900 rounded-xl flex-shrink-0" />
          <div className="w-28 h-9 bg-slate-900 rounded-xl flex-shrink-0" />
          <div className="w-24 h-9 bg-slate-900 rounded-xl flex-shrink-0" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-900 rounded-2xl" />
          <div className="h-24 bg-slate-900 rounded-2xl" />
        </div>
        <div className="h-60 bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  // 2️⃣ SERVER RECONNECT STATE
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-[#eb6923]/20 rounded-full animate-ping" />
          <div className="w-20 h-20 bg-slate-900 border border-[#eb6923]/50 rounded-2xl flex items-center justify-center shadow-3d-orange relative z-10">
            <i className="fa-solid fa-wifi-slash text-2xl text-[#eb6923] animate-bounce"></i>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white tracking-wide">
            CAD Server Offline
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Unable to sync live architectural blueprints. Check your network or retry below.
          </p>
        </div>

        <button 
          onClick={fetchLiveHome}
          className="px-6 py-3 bg-gradient-to-r from-[#eb6923] to-[#ff7828] text-white font-extrabold text-xs rounded-xl shadow-3d-orange border border-white/20 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-rotate-right"></i> Reconnect to Server
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 text-left max-w-md md:max-w-xl mx-auto">
      
      {/* 🏙️ HERO SECTION: 3D HYPER-REALISTIC ARCHITECTURAL PERSPECTIVE SHOWCASE */}
      {heroSlides.length > 0 && (
        <div className="relative w-full h-[300px] xs:h-[320px] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group perspective-1000">
          
          {/* Subtle Isometric Blueprint Grid Backdrop */}
          <div className="absolute inset-0 blueprint-grid opacity-30 z-0 pointer-events-none" />
          
          {/* Technical Corner HUD Accents */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CAD PERSPECTIVE • LIVE</span>
          </div>

          <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#ff8c42]">
            SCALE 1:100
          </div>

          {/* Slides Carousel */}
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
                {/* 3D Background Render with Parallax Depth */}
                <img 
                  src={slide.image_url} 
                  alt={slide.title} 
                  className="w-full h-full object-cover brightness-[0.65] contrast-125 transform transition-transform duration-1000 group-hover:scale-105" 
                />

                {/* Ambient Radial Glow & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent z-10" />

                {/* Floating Content Card with 3D Depth */}
                <div className="absolute inset-0 p-5 xs:p-6 flex flex-col justify-end z-20">
                  
                  {/* Floating Tag Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#eb6923] to-[#ff8c42] text-white px-3 py-1 rounded-full shadow-[0_0_15px_rgba(235,105,35,0.4)]">
                      Architectural Blueprint
                    </span>
                    <span className="text-[9px] font-mono text-slate-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hidden xs:inline-block">
                      <i className="fa-solid fa-compass-drafting mr-1 text-[#ff8c42]"></i> Vaastu Verified
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl xs:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md max-w-sm mb-3">
                    {slide.title}
                  </h2>

                  {/* 3D Tactile Call-To-Action Button */}
                  <div className="flex items-center gap-3 mt-1">
                    <button 
                      onClick={() => handleAction(slide.page_path)}
                      className="flex-1 py-3 px-5 bg-gradient-to-r from-[#eb6923] via-[#ff7828] to-[#eb6923] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-3d-orange border border-white/20 active:translate-y-[2px] transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-layer-group text-sm"></i>
                      <span>{slide.subtitle || "Order Plan"}</span>
                    </button>
                    
                    {/* Quick Preview Icon Button */}
                    <button
                      onClick={() => {
                        const path = slide.page_path?.toLowerCase();
                        if (path === '2d' || path === '3d') {
                          handleAction(path);
                        } else {
                          handleAction('src/Project/project1.jsx');
                        }
                      }}
                      title="Inspect 3D Blueprint"
                      className="w-12 h-12 rounded-2xl bg-slate-900/90 hover:bg-[#eb6923]/20 border border-white/15 hover:border-[#eb6923]/60 text-slate-200 hover:text-[#ff8c42] flex items-center justify-center transition-all duration-200 tactile-click cursor-pointer"
                    >
                      <i className="fa-solid fa-cube text-base"></i>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

          {/* Slide Indicator Dots with Glowing Fill */}
          {heroSlides.length > 1 && (
            <div className="absolute top-3 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeSlide === idx 
                      ? 'w-7 bg-gradient-to-r from-[#eb6923] to-[#ff8c42] shadow-[0_0_8px_#eb6923]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* 🧭 INTERACTIVE 3D ARCHITECTURAL SPATIAL TEASER CARD */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#eb6923]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eb6923]/20 text-[#eb6923] flex items-center justify-center text-xs border border-[#eb6923]/30">
              <i className="fa-solid fa-shapes"></i>
            </div>
            <div>
              <h4 className="text-xs font-black text-white tracking-wide uppercase">
                3D CAD Studio Engine
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Interactive Elevation & Vaastu Blueprint
              </p>
            </div>
          </div>

          {/* 3D Mode Toggle Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-white/10 text-[9px] font-mono">
            <button
              onClick={() => setSpatialMode('2d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                spatialMode === '2d' 
                  ? 'bg-[#eb6923] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D CAD
            </button>
            <button
              onClick={() => setSpatialMode('3d')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                spatialMode === '3d' 
                  ? 'bg-[#eb6923] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D ISOMETRIC
            </button>
          </div>
        </div>

        {/* Spatial Blueprint Graphic Preview */}
        <div className="relative h-28 rounded-2xl bg-slate-950 border border-white/5 p-3 flex items-center justify-between overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-25" />
          
          {/* Technical Blueprint Vector Sketch */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#eb6923]">
                {spatialMode === '3d' ? '3D ELEVATION MATRIX' : '2D VAASTU FLOOR GRID'}
              </span>
              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 font-mono">
                AUTO-CALC
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium max-w-[210px] leading-tight">
              {spatialMode === '3d' 
                ? 'Photorealistic 3D elevations, exterior textures & luxury glass facades.'
                : 'Custom Vaastu-compliant layout planning, door placements & room sizing.'}
            </p>
            <div className="flex gap-2 text-[9px] font-mono text-slate-400 pt-1">
              <span>W: 30-60 FT</span>
              <span>•</span>
              <span>L: 40-100 FT</span>
              <span>•</span>
              <span className="text-[#ff8c42]">100% VAASTU</span>
            </div>
          </div>

          {/* 3D Isometric Cube Accent */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center">
            <div className={`w-14 h-14 rounded-2xl border-2 border-[#eb6923]/60 bg-gradient-to-br from-[#eb6923]/20 to-transparent flex items-center justify-center shadow-cad-glow transition-transform duration-500 ${
              spatialMode === '3d' ? 'transform rotate-12 scale-105' : 'transform rotate-0'
            }`}>
              <i className={`fa-solid ${spatialMode === '3d' ? 'fa-cube' : 'fa-ruler-combined'} text-2xl text-[#eb6923]`}></i>
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ HORIZONTAL SCROLL TAGS CONTAINER (3D Tactical Pill Chips) */}
      {categories.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Filter By Category
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              {filteredItems.length} Projects Available
            </span>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar py-1">
            <div className="flex gap-2 px-0.5">
              {categories.map((cat) => {
                const isSelected = selectedTag === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedTag(cat)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-2xl transition-all duration-200 tactile-click flex-shrink-0 cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#eb6923] to-[#ff7828] text-white shadow-3d-orange border border-white/20' 
                        : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-white/10 hover:border-[#eb6923]/40'
                    }`}
                  >
                    {isSelected && <i className="fa-solid fa-check text-[10px] mr-1.5 text-white"></i>}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🎛️ UTILITY ZONE: 3D ISOMETRIC ACTION CARDS */}
      {dbUtilities.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
            Instant Design Services
          </span>

          <div className="grid grid-cols-2 gap-3.5">
            {dbUtilities.map((util) => (
              <div 
                key={util.id}
                onClick={() => handleAction(util.page_path || util.type)}
                className="group relative p-4 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-[#eb6923]/60 shadow-lg hover:shadow-cad-glow transition-all duration-300 card-3d-tilt tactile-click cursor-pointer overflow-hidden"
              >
                {/* Subtle top corner CAD crosshair */}
                <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-600 group-hover:text-[#eb6923]">
                  +CAD
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#eb6923]/20 to-transparent border border-[#eb6923]/30 rounded-2xl flex items-center justify-center text-[#ff8c42] shadow-inner-glow group-hover:scale-110 group-hover:shadow-cad-glow transition-all">
                    <i className={`fa-solid ${util.icon_class || 'fa-ruler-combined'} text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-[#ff8c42] transition-colors truncate">
                      {util.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {util.subtitle}
                    </p>
                  </div>
                </div>

                {/* Arrow hint */}
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#eb6923] font-bold">
                  <span>CONFIGURE</span>
                  <i className="fa-solid fa-arrow-right text-[9px] transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🖼️ LOWER DECK SECTION: FEATURED BLUEPRINTS & PROJECTS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#eb6923] animate-pulse"></span>
            Featured Blueprints & Projects
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            SHOWCASE DECK
          </span>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-white/10 text-center text-slate-400 text-xs">
            <i className="fa-solid fa-compass-drafting text-2xl text-slate-600 mb-2 block"></i>
            No blueprints under this category yet!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleAction(item.page_path || item.type)}
                className="bg-slate-900/80 rounded-3xl overflow-hidden border border-white/10 hover:border-[#eb6923]/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] group flex flex-col transition-all duration-300 card-3d-tilt cursor-pointer relative"
              >
                {/* Image Showcase Container */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100" 
                  />

                  {/* Gradient Lighting */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 text-[9px] font-extrabold tracking-wider uppercase bg-black/75 backdrop-blur-md text-white border border-white/15 px-2.5 py-1 rounded-xl shadow-md">
                    {item.category_tag}
                  </span>

                  {/* Location Badge */}
                  {item.location && (
                    <span className="absolute bottom-3 left-3 text-[9px] font-mono font-bold bg-black/80 backdrop-blur-md text-[#ff8c42] border border-[#eb6923]/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
                      <i className="fa-solid fa-location-dot text-[8px]"></i>
                      {item.location}
                    </span>
                  )}

                  {/* 3D Blueprint CAD Badge */}
                  <span className="absolute top-3 right-3 text-[9px] font-mono font-bold bg-[#eb6923] text-white px-2 py-0.5 rounded-lg shadow-md">
                    CAD VERIFIED
                  </span>
                </div>

                {/* Details Bar */}
                <div className="p-4 flex items-center justify-between gap-4 text-left">
                  <div className="overflow-hidden space-y-0.5">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-[#ff8c42] transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate font-mono">
                      {item.subtitle}
                    </p>
                  </div>
                  
                  {/* Action Arrow Button with 3D Pop */}
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 group-hover:border-[#eb6923] group-hover:bg-[#eb6923] group-hover:text-white flex items-center justify-center text-[#ff8c42] flex-shrink-0 transition-all duration-300 shadow-md group-hover:shadow-3d-orange">
                    <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;
