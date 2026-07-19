import React, { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import Auth from '../lib/auth';

// 🚀 MAGIC TOOL: Ye line 'src/pages' folder ki saari .jsx files ko automatic scan kar legi!
const dynamicPages = import.meta.glob('../lib/*.jsx');



function Home() {
  const [cmsData, setCmsData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
      const [user, setUser] = useState(null);

  // 🔐 Active login authentication status checker hook
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    fetchLiveHome();
  }, []);

  const fetchLiveHome = async () => {
    try {
      const { data } = await supabase.from('ecore_home_cms').select('*');
      setCmsData(data || []);
    } catch (err) {
      console.error("Error fetching homepage elements:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔌 Extract layers from live database array
  const dbHero = cmsData.filter(i => i.section_type === 'hero');
  const dbTags = cmsData.filter(i => i.section_type === 'tag');
  const dbUtilities = cmsData.filter(i => i.section_type === 'utility');
  const dbLower = cmsData.filter(i => i.section_type === 'lower_block');

  // 🎭 Static Fallbacks (If DB has no elements)
  const defaultHero = [
    { id: 'dh1', title: "Professional 2D Layout Planning", subtitle: "MAKE YOUR PLAN @ ONLY ₹999", page_path: "service", image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" },
    { id: 'dh2', title: "Vray & Lumion Style Lighting Look", subtitle: "MAKE YOUR ELEVATION @ ONLY ₹1999", page_path: "service", image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600" }
  ];

  const defaultLower = [
    { id: 'dl1', category_tag: "Residential Building", title: "Modern 3BHK Duplex House Plan", subtitle: "30x40 Sq.Ft • Vastu Compliant", location: "Delhi", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", page_path: "portfolio-1" },
    { id: 'dl2', category_tag: "Commercial", title: "Premium Corporate Office Space Layout", subtitle: "45x60 Sq.Ft • Multi-Floor Complex", location: "Mumbai", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", page_path: "portfolio-2" },
    { id: 'dl3', category_tag: "Educational Building", title: "Contemporary School Building Design", subtitle: "80x120 Sq.Ft • Open Courtyard Style", location: "Gujarat Region", image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600", page_path: "portfolio-3" }
  ];

  const heroSlides = dbHero.length > 0 ? dbHero : defaultHero;
  const categories = ["All", ...(dbTags.length > 0 ? dbTags.map(t => t.title) : ["Residential Building", "Commercial", "Educational Building", "Interior Projects"])];
  const portfolioItems = dbLower.length > 0 ? dbLower : defaultLower;

  // Slider timing loop
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

  if (loading) return <div className="py-20 text-center text-xs font-bold text-gray-400">Loading Client Dashboard...</div>;
    // 🧭 AUTOMATIC AUTO-PILOT ROUTER
  const currentHash = window.location.hash;
  
  if (currentHash && currentHash !== '#/' && currentHash !== '#/home') {
    const pageKey = currentHash.replace('#/', ''); 
    const matchingFileKey = Object.keys(dynamicPages).find(key => key.includes(`/${pageKey}.jsx`));

    if (matchingFileKey) {
      // 🛑 Strict Security Check: Client authenticated or not?
      if (!user) {
        return <Auth />; // Login nahi hai toh seedha Login Screen phenko
      }

      const DynamicComponent = lazy(dynamicPages[matchingFileKey]);

      return (
        <Suspense fallback={<div className="py-20 text-center text-xs font-bold text-gray-400">Loading Layout Page...</div>}>
          <DynamicComponent />
        </Suspense>
      );
    }
  }


  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* 🏙️ HERO SECTION */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md bg-slate-900 group">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id} 
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
                onClick={() => window.location.hash = `#/${slide.page_path}`}
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

      {/* 🏷️ HORIZONTAL SCROLL TAGS CONTAINER */}
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

      {/* 🎛️ UTILITY ZONE: INTERACTION BUTTON ROWS */}
      <div className="grid grid-cols-2 gap-4">
        {dbUtilities.length > 0 ? (
          dbUtilities.map((util) => (
            <div 
              key={util.id}
              onClick={() => window.location.hash = `#/${util.page_path}`}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 bg-orange-500/10 text-[#eb6923] rounded-xl flex items-center justify-center flex-shrink-0">
                <i className={`fa-solid ${util.icon_class || 'fa-calculator'} text-base`}></i>
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{util.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{util.subtitle}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <div onClick={() => window.location.hash = '#/budget'} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all">
              <div className="w-9 h-9 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-calculator text-base"></i></div>
              <div className="text-left overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">Budget Calculator</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">Estimate project cost</p>
              </div>
            </div>
            <div onClick={() => window.location.hash = '#/gallery'} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all">
              <div className="w-9 h-9 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-compass-drafting text-base"></i></div>
              <div className="text-left overflow-hidden">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">Plan Gallery</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">Explore house catalog</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🖼️ LOWER DECK SECTION */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold tracking-wider text-gray-400 dark:text-gray-500 uppercase text-left pl-0.5">
          Featured Blueprints & Projects
        </h3>
        
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 text-center text-gray-400 text-xs">
            No designs added under this catalog yet!
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
                    onClick={() => window.location.hash = `#/${item.page_path}`}
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
          
