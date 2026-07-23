import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Home({ user, changeTab, setFormType }) {
  const [cmsData, setCmsData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchLiveHome();
  }, []);

  const fetchLiveHome = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase.from('ecore_home_cms').select('*');
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCmsData(data);
      } else {
        // Agar database khali ho tab bhi error handle karenge
        setCmsData([]);
      }
    } catch (err) {
      console.error("Error fetching homepage elements:", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Pure Admin Panel Data Filters (No Defaults)
  const heroSlides = cmsData.filter(i => i.section_type === 'hero');
  const dbTags = cmsData.filter(i => i.section_type === 'tag');
  const dbUtilities = cmsData.filter(i => i.section_type === 'utility');
  const portfolioItems = cmsData.filter(i => i.section_type === 'lower_block');

  const categories = ["All", ...dbTags.map(t => t.title)];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroSlides]);

  const filteredItems = selectedTag === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category_tag === selectedTag);

  // Centralized Navigation Handler
  const handleAction = (formTypeTarget = '2d') => {
    if (user) {
      if (typeof setFormType === 'function') setFormType(formTypeTarget);
      if (typeof changeTab === 'function') changeTab('service');
    } else {
      if (typeof changeTab === 'function') changeTab('profile');
    }
  };

  // 1️⃣ LOADING STATE (Shimmer/Pulse Theme Animation)
  if (loading) {
    return (
      <div className="space-y-6 pb-20 animate-pulse">
        <div className="w-full h-56 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="flex gap-2 overflow-x-auto py-1">
          <div className="w-20 h-8 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-24 h-8 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-28 h-8 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-20 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // 2️⃣ SERVER DOWN / FETCH ERROR STATE (Animated Premium Look)
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fadeIn">
        <div className="relative flex items-center justify-center">
          {/* Animated Glow Ring around Icon */}
          <div className="absolute w-20 h-20 bg-[#eb6923]/20 rounded-full animate-ping"></div>
          <div className="w-20 h-20 bg-white dark:bg-slate-900 border-2 border-[#eb6923] rounded-2xl flex items-center justify-center shadow-lg relative z-10">
            <i className="fa-solid fa-wifi-slash text-3xl text-[#eb6923] animate-bounce"></i>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
            Server Connection Lost
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
            Unable to sync designs from server. Please check your network connection or try again.
          </p>
        </div>

        <button 
          onClick={fetchLiveHome}
          className="px-6 py-2.5 bg-[#eb6923] text-white font-bold text-xs rounded-xl shadow-md border-b-4 border-orange-700 active:scale-95 transition-transform flex items-center gap-2"
        >
          <i className="fa-solid fa-rotate-right"></i> Try Again
        </button>
      </div>
    );
  }

  // 3️⃣ NORMAL LIVE DATA DISPLAY
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* 🏙️ HERO SECTION */}
      {heroSlides.length > 0 && (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md bg-slate-900 group">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id || index} 
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${index === activeSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
              <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover opacity-40 brightness-75" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                <div className="text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#eb6923] text-white px-2.5 py-1 rounded-full">
                    Architectural Blueprint
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">{slide.title}</h2>
                </div>
                <button 
                  onClick={() => handleAction(slide.type || '2d')}
                  className="w-full py-2.5 bg-[#eb6923] text-white font-bold rounded-xl text-xs border-b-4 border-orange-700 shadow-sm transition-all active:translate-y-[2px] active:border-b-2"
                >
                  {slide.subtitle || "Order Plan"}
                </button>
              </div>
            </div>
          ))}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-16 right-5 flex gap-1.5 z-10">
              {heroSlides.map((_, idx) => (
                <div key={idx} onClick={() => setActiveSlide(idx)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === idx ? 'w-4 bg-[#eb6923]' : 'w-1.5 bg-white/50'}`}></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🏷️ HORIZONTAL SCROLL TAGS CONTAINER */}
      {categories.length > 1 && (
        <div className="w-full overflow-x-auto no-scrollbar py-1">
          <div className="flex gap-2.5 whitespace-nowrap px-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                  selectedTag === cat 
                    ? 'bg-[#eb6923] text-white shadow-sm border border-transparent' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-gray-400 border border-gray-100 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🎛️ UTILITY ZONE: INTERACTION BUTTON ROWS */}
      {dbUtilities.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {dbUtilities.map((util) => (
            <div 
              key={util.id}
              onClick={() => handleAction(util.type || '2d')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 bg-orange-500/10 text-[#eb6923] rounded-xl flex items-center justify-center flex-shrink-0">
                <i className={`fa-solid ${util.icon_class || 'fa-ruler-combined'} text-base`}></i>
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{util.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{util.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🖼️ LOWER DECK SECTION */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold tracking-wider text-gray-400 dark:text-gray-500 uppercase text-left pl-0.5">
          Featured Blueprints & Projects
        </h3>
        
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 text-center text-gray-400 text-xs">
            No designs added from admin yet!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm group flex flex-col transition-all"
              >
                <div className="relative h-44 w-full bg-gray-100 dark:bg-slate-950 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 text-[9px] font-extrabold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                    {item.category_tag}
                  </span>
                  {item.location && (
                    <span className="absolute bottom-3 right-3 text-[9px] font-bold bg-white/95 text-slate-800 dark:bg-slate-900 dark:text-slate-100 px-2.5 py-1 rounded-md shadow-sm">
                      {item.location}
                    </span>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between gap-4 text-left">
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.subtitle}</p>
                  </div>
                  <div 
                    onClick={() => handleAction(item.type || '2d')}
                    className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-[#eb6923] flex-shrink-0 active:scale-90 transition-transform cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-right text-xs"></i>
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
