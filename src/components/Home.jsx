import React, { useState, useEffect } from 'react';

function Home() {
  // 🧭 Slider active index selector state
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');

  // Automatic slide changer logic loop
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  // 🏷️ Horizontal Scroll Categories
  const categories = ["All", "Residential Building", "Commercial", "Educational Building", "Interior Projects"];

  // 🎛️ Sample Static Blocks (Later we will connect this array directly to Admin Panel/Supabase)
  const portfolioItems = [
    {
      id: 1,
      tag: "Residential Building",
      title: "Modern 3BHK Duplex House Plan",
      specs: "30x40 Sq.Ft • Vastu Compliant",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
      location: "Delhi"
    },
    {
      id: 2,
      tag: "Commercial",
      title: "Premium Corporate Office Space Layout",
      specs: "45x60 Sq.Ft • Multi-Floor Complex",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
      location: "Mumbai"
    },
    {
      id: 3,
      tag: "Educational Building",
      title: "Contemporary School Building Design",
      specs: "80x120 Sq.Ft • Open Courtyard Style",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600",
      location: "Gujarat Region"
    }
  ];

  // Filtering Logic Based on Selection Tags
  const filteredItems = selectedTag === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.tag === selectedTag);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      
      {/* 🏙️ HERO SECTION: Dual Sliding Premium Cards */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md bg-slate-900 group">
        
        {/* Slide 1: 2D Layout Plan */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${activeSlide === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" 
            alt="2D Plan Showcase" 
            className="w-full h-full object-cover opacity-40 brightness-75"
          />
          <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#eb6923] text-white px-2.5 py-1 rounded-full">
                Architectural Blueprint
              </span>
              <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">Professional 2D Layout Planning</h2>
              <p className="text-xs text-gray-300 mt-1">Smart spacing matrix tailored for your custom plots.</p>
            </div>
            <button className="w-full py-2.5 bg-[#eb6923] text-white font-bold rounded-xl text-xs border-b-4 border-orange-700 shadow-sm transition-all active:translate-y-[2px] active:border-b-2">
              MAKE YOUR PLAN @ ONLY ₹999
            </button>
          </div>
        </div>

        {/* Slide 2: 3D Elevation */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${activeSlide === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600" 
            alt="3D Elevation Render" 
            className="w-full h-full object-cover opacity-40 brightness-75"
          />
          <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-600 text-white px-2.5 py-1 rounded-full">
                Realistic 3D Elevation
              </span>
              <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">Vray & Lumion Style Lighting Look</h2>
              <p className="text-xs text-gray-300 mt-1">Premium residential exterior rendering configurations.</p>
            </div>
            <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs border-b-4 border-blue-800 shadow-sm transition-all active:translate-y-[2px] active:border-b-2">
              MAKE YOUR ELEVATION @ ONLY ₹1999
            </button>
          </div>
        </div>

        {/* Slider Manual Navigation Dots */}
        <div className="absolute bottom-16 right-5 flex gap-1.5 z-10">
          <div onClick={() => setActiveSlide(0)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === 0 ? 'w-4 bg-[#eb6923]' : 'w-1.5 bg-white/50'}`}></div>
          <div onClick={() => setActiveSlide(1)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === 1 ? 'w-4 bg-blue-600' : 'w-1.5 bg-white/50'}`}></div>
        </div>
      </div>

      {/* 🏷️ CATEGORY LIST: Horizontal Scroll Filter Pills Bar */}
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

      {/* 🎛️ UTILITY ZONE: 2 Row Box Buttons with Clean Icons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Button A: Cost Estimator */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all">
          <div className="w-9 h-9 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-calculator text-base"></i>
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">Budget Calculator</h4>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">Estimate project cost</p>
          </div>
        </div>

        {/* Button B: Plan Gallery */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-3.5 cursor-pointer active:scale-[0.97] transition-all">
          <div className="w-9 h-9 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-compass-drafting text-base"></i>
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">Plan Gallery</h4>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">Explore house catalog</p>
          </div>
        </div>
      </div>

      {/* 🖼️ LOWER DECK SECTION: Premium Detailed Dynamic Rows */}
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
                {/* Upper block image container */}
                <div className="relative h-44 w-full bg-gray-100 dark:bg-slate-950 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {/* Category floating tag container layout */}
                  <span className="absolute top-3 left-3 text-[9px] font-extrabold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                    {item.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 text-[9px] font-bold bg-white/95 text-slate-800 dark:bg-slate-900 dark:text-slate-100 px-2.5 py-1 rounded-md shadow-sm">
                    {item.location}
                  </span>
                </div>

                {/* Lower details row container panel */}
                <div className="p-4 flex items-center justify-between gap-4 text-left">
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {item.specs}
                    </p>
                  </div>
                  
                  {/* Flexbox Action indicator button link row */}
                  <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-[#eb6923] flex-shrink-0 active:scale-90 transition-transform cursor-pointer">
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
