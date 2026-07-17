import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function HomePortfolio() {
  const [cmsData, setCmsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📝 Form Fields States
  const [sectionType, setSectionType] = useState('lower_block');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [path, setPath] = useState('');
  const [category, setCategory] = useState('');
  const [iconClass, setIconClass] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    const { data } = await supabase.from('ecore_home_cms').select('*').order('created_at', { ascending: true });
    setCmsData(data || []);
  };

  const handleInsertOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = '';
      if (file) {
        const fileName = `cms/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('site-images').upload(fileName, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      const payload = {
        section_type: sectionType,
        title,
        subtitle,
        page_path: path,
        category_tag: category,
        icon_class: iconClass,
        ...(finalImageUrl && { image_url: finalImageUrl })
      };

      const { error } = await supabase.from('ecore_home_cms').insert([payload]);
      if (error) throw error;

      alert("Ecore Custom Content Saved Successfully!");
      resetForm();
      fetchCmsData();
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Kya aap sach me is live block ko hatana chahte hain?")) return;
    await supabase.from('ecore_home_cms').delete().eq('id', id);
    fetchCmsData();
  };

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setPath(''); setCategory(''); setIconClass(''); setFile(null);
  };

  return (
    <div className="space-y-6 pb-24 text-left">
      {/* 👑 Section Header */}
      <div className="border-b pb-2 border-gray-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Home Engine Customizer</h3>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-[#eb6923]/10 text-[#eb6923] rounded-full">Fully Customized CMS</span>
      </div>

      {/* 🛠️ MASTER SETTINGS PORTAL */}
      <form onSubmit={handleInsertOrUpdate} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="font-bold text-xs text-[#eb6923] uppercase tracking-wider">Select and Configure Live Block</h4>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Target Section Layer</label>
          <select 
            value={sectionType} 
            onChange={(e) => setSectionType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-[#eb6923]"
          >
            <option value="hero">Hero Slider Card (Rates & Text)</option>
            <option value="tag">Horizontal Scroll Tag (Categories)</option>
            <option value="utility">Utility Box Button (Estimator / Gallery)</option>
            <option value="lower_block">Lower Featured Showcase Row</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Element Title / Main Text</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Plan Gallery / Modern Duplex" className="w-full px-3 py-2.5 rounded-xl border dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:border-[#eb6923]" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Subtitle / Pricing / Specs</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Only 999 Rs / 30x40 Sq.Ft" className="w-full px-3 py-2.5 rounded-xl border dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:border-[#eb6923]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Target Page Link Route (.jsx file path)</label>
            <input type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. plan-gallery / portfolio-1" className="w-full px-3 py-2.5 rounded-xl border dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:border-[#eb6923]" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Matching Tag / FontAwesome Icon</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Residential / fa-calculator" className="w-full px-3 py-2.5 rounded-xl border dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:border-[#eb6923]" />
          </div>
        </div>

        {['hero', 'lower_block'].includes(sectionType) && (
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Upload Rendering / Layout Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-xs w-full p-2 border border-dashed rounded-xl dark:border-slate-700" />
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3 bg-[#eb6923] text-white font-bold rounded-xl text-xs border-b-4 border-orange-700 shadow-sm active:translate-y-[2px] active:border-b-2 disabled:opacity-50 transition-all">
          {loading ? "Syncing Database Matrix..." : "PUBLISH TO PUBLIC WEB HOME"}
        </button>
      </form>

      {/* 📊 MANAGEMENT ENGINE */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Live Workspace Canvas Elements</h4>
        
        {['hero', 'tag', 'utility', 'lower_block'].map((sec) => (
          <div key={sec} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
            <h5 className="text-xs font-extrabold uppercase tracking-widest text-[#eb6923] border-b pb-1 border-gray-100 dark:border-slate-800">{sec.replace('_', ' ')} Layer</h5>
            <div className="space-y-2">
              {cmsData.filter(item => item.section_type === sec).map(filteredItem => (
                <div key={filteredItem.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-gray-100 dark:border-slate-900">
                  <div className="text-xs overflow-hidden pr-2 flex items-center gap-2">
                    {filteredItem.image_url && <img src={filteredItem.image_url} className="w-8 h-8 rounded-lg object-cover" />}
                    <div className="truncate">
                      <p className="font-bold text-slate-800 dark:text-gray-200 truncate">{filteredItem.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">Triggers Link: <span className="text-[#eb6923]">#/{filteredItem.page_path}</span></p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(filteredItem.id)} className="px-2.5 py-1.5 bg-red-50 text-red-500 dark:bg-red-950/20 rounded-lg text-[10px] font-bold border border-red-200/20 active:scale-95 transition-all">
                    Delete
                  </button>
                </div>
              ))}
              {cmsData.filter(item => item.section_type === sec).length === 0 && (
                <p className="text-[11px] text-gray-400 italic">No live elements added in this segment.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePortfolio;
