import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function HomePortfolio() {
  const [cmsData, setCmsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Separate forms layout config configurations
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', path: '', file: null });
  const [tagForm, setTagForm] = useState({ title: '' });
  const [utilForm, setUtilForm] = useState({ title: '', subtitle: '', path: '', icon: '' });
  const [lowerForm, setLowerForm] = useState({ title: '', subtitle: '', path: '', tag: '', location: '', file: null });

  // Separate edit holder state variables
  const [editFields, setEditFields] = useState({});

  useEffect(() => { fetchCmsData(); }, []);

  const fetchCmsData = async () => {
    const { data } = await supabase.from('ecore_home_cms').select('*').order('created_at', { ascending: true });
    setCmsData(data || []);
  };

  const uploadFile = async (fileObj) => {
    if (!fileObj) return '';
    const fileName = `cms/${Date.now()}_${fileObj.name}`;
    const { error: upErr } = await supabase.storage.from('site-images').upload(fileName, fileObj);
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleCreate = async (type, e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = { section_type: type };
      
      if (type === 'hero') {
        const img = await uploadFile(heroForm.file);
        payload = { ...payload, title: heroForm.title, subtitle: heroForm.subtitle, page_path: heroForm.path, image_url: img };
      } else if (type === 'tag') {
        payload = { ...payload, title: tagForm.title, page_path: 'filter-action' };
      } else if (type === 'utility') {
        payload = { ...payload, title: utilForm.title, subtitle: utilForm.subtitle, page_path: utilForm.path, icon_class: utilForm.icon };
      } else if (type === 'lower_block') {
        const img = await uploadFile(lowerForm.file);
        payload = { ...payload, title: lowerForm.title, subtitle: lowerForm.subtitle, page_path: lowerForm.path, category_tag: lowerForm.tag, location: lowerForm.location, image_url: img };
      }

      const { error } = await supabase.from('ecore_home_cms').insert([payload]);
      if (error) throw error;
      
      alert(`Successfully added into ${type} layout!`);
      clearForms(type);
      fetchCmsData();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, type) => {
    setLoading(true);
    try {
      let currentEditFile = editFields._file_ref;
      let updatePayload = { ...editFields };
      delete updatePayload._file_ref;

      if (currentEditFile) {
        const uploadedUrl = await uploadFile(currentEditFile);
        updatePayload.image_url = uploadedUrl;
      }

      const { error } = await supabase.from('ecore_home_cms').update(updatePayload).eq('id', id);
      if (error) throw error;

      alert("Block entry customized safely!");
      setEditingId(null);
      fetchCmsData();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to completely erase this node from database?")) return;
    await supabase.from('ecore_home_cms').delete().eq('id', id);
    fetchCmsData();
  };

  const clearForms = (type) => {
    if(type === 'hero') setHeroForm({ title: '', subtitle: '', path: '', file: null });
    if(type === 'tag') setTagForm({ title: '' });
    if(type === 'utility') setUtilForm({ title: '', subtitle: '', path: '', icon: '' });
    if(type === 'lower_block') setLowerForm({ title: '', subtitle: '', path: '', tag: '', location: '', file: null });
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditFields({
      title: item.title,
      subtitle: item.subtitle || '',
      page_path: item.page_path,
      category_tag: item.category_tag || '',
      location: item.location || '',
      icon_class: item.icon_class || '',
      image_url: item.image_url || ''
    });
  };

  return (
    <div className="space-y-10 pb-32 text-left text-slate-800 dark:text-gray-100 max-w-4xl mx-auto">
      <div className="border-b pb-3 border-gray-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-black tracking-wide text-[#eb6923]">Ecore CMS Command Matrix</h2>
        <span className="text-[10px] font-bold px-3 py-1 bg-orange-500/10 text-[#eb6923] rounded-full uppercase">Granular Layout Control</span>
      </div>

      {/* 🏙️ MODULE 1: HERO CANVAS CONSOLE */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-[#eb6923] border-b pb-2 dark:border-slate-800">1. Hero Showcase Slides</h3>
        <form onSubmit={(e) => handleCreate('hero', e)} className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Slide Heading Text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Price Text (e.g. @ ₹999)" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Target Route Page (e.g. plan-gallery)" value={heroForm.path} onChange={e => setHeroForm({...heroForm, path: e.target.value})} required />
          <input className="text-xs border rounded-xl p-1 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 dark:file:bg-slate-800 dark:file:text-white" type="file" accept="image/*" onChange={e => setHeroForm({...heroForm, file: e.target.files[0]})} required />
          <button type="submit" disabled={loading} className="col-span-2 py-2 bg-[#eb6923] text-white font-bold text-xs rounded-xl border-b-4 border-orange-700 active:translate-y-[2px] transition-all">INJECT SLIDE DECK</button>
        </form>
        <div className="space-y-2 mt-2">
          {cmsData.filter(i => i.section_type === 'hero').map(item => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border flex flex-col gap-2">
              {editingId === item.id ? (
                <div className="space-y-2 grid grid-cols-2 gap-2">
                  <input className="text-xs p-1.5 border rounded-lg bg-transparent" type="text" value={editFields.title} onChange={e => setEditFields({...editFields, title: e.target.value})} />
                  <input className="text-xs p-1.5 border rounded-lg bg-transparent" type="text" value={editFields.subtitle} onChange={e => setEditFields({...editFields, subtitle: e.target.value})} />
                  <input className="text-xs p-1.5 border rounded-lg bg-transparent" type="text" value={editFields.page_path} onChange={e => setEditFields({...editFields, page_path: e.target.value})} />
                  <input className="text-xs p-1.5" type="file" onChange={e => setEditFields({...editFields, _file_ref: e.target.files[0]})} />
                  <div className="col-span-2 flex gap-2">
                    <button onClick={() => handleUpdate(item.id, 'hero')} className="px-3 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded-md">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-500 text-white font-bold text-[10px] rounded-md">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <img src={item.image_url} className="w-10 h-8 object-cover rounded" />
                    <span className="font-bold truncate">{item.title} ({item.subtitle})</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(item)} className="px-2 py-1 bg-blue-500 text-white font-bold text-[10px] rounded-md">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-500 text-white font-bold text-[10px] rounded-md">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🏷️ MODULE 2: CATEGORY FILTER CHIPS LAYER */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-[#eb6923] border-b pb-2 dark:border-slate-800">2. Horizontal Capsule Scrolling Tags</h3>
        <form onSubmit={(e) => handleCreate('tag', e)} className="flex gap-2">
          <input className="flex-1 px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="New Tag String Name (e.g. Commercial Building)" value={tagForm.title} onChange={e => setTagForm({title: e.target.value})} required />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-[#eb6923] text-white font-bold text-xs rounded-xl">CREATE TAG</button>
        </form>
        <div className="flex flex-wrap gap-2 pt-2">
          {cmsData.filter(i => i.section_type === 'tag').map(item => (
            <div key={item.id} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-950 border rounded-xl text-xs">
              {editingId === item.id ? (
                <>
                  <input className="text-xs p-0.5 border rounded bg-transparent" value={editFields.title} onChange={e => setEditFields({...editFields, title: e.target.value})} />
                  <button onClick={() => handleUpdate(item.id, 'tag')} className="text-emerald-500 font-bold ml-1 text-[10px]">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 font-bold ml-1 text-[10px]">✕</button>
                </>
              ) : (
                <>
                  <span className="font-semibold">{item.title}</span>
                  <i onClick={() => startEditing(item)} className="fa-solid fa-pen text-[9px] text-blue-500 cursor-pointer pl-1"></i>
                  <i onClick={() => handleDelete(item.id)} className="fa-solid fa-xmark text-[10px] text-red-500 cursor-pointer pl-1"></i>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🎛️ MODULE 3: QUICK UTILITY PORTAL MAPPERS */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-[#eb6923] border-b pb-2 dark:border-slate-800">3. Utility Action Buttons Box</h3>
        <form onSubmit={(e) => handleCreate('utility', e)} className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Utility Box Title" value={utilForm.title} onChange={e => setUtilForm({...utilForm, title: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Helper description text" value={utilForm.subtitle} onChange={e => setUtilForm({...utilForm, subtitle: e.target.value})} />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Router link page (e.g. budget-calculator)" value={utilForm.path} onChange={e => setUtilForm({...utilForm, path: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="FontAwesome Icon Class (e.g. fa-calculator)" value={utilForm.icon} onChange={e => setUtilForm({...utilForm, icon: e.target.value})} />
          <button type="submit" disabled={loading} className="col-span-2 py-2 bg-[#eb6923] text-white font-bold text-xs rounded-xl border-b-4 border-orange-700 active:translate-y-[2px] transition-all">MOUNT UTILITY BOX</button>
        </form>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {cmsData.filter(i => i.section_type === 'utility').map(item => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border text-xs">
              {editingId === item.id ? (
                <div className="space-y-1.5 flex flex-col">
                  <input className="text-[10px] border p-1 bg-transparent rounded" type="text" value={editFields.title} onChange={e => setEditFields({...editFields, title: e.target.value})} />
                  <input className="text-[10px] border p-1 bg-transparent rounded" type="text" value={editFields.subtitle} onChange={e => setEditFields({...editFields, subtitle: e.target.value})} />
                  <input className="text-[10px] border p-1 bg-transparent rounded" type="text" value={editFields.page_path} onChange={e => setEditFields({...editFields, page_path: e.target.value})} />
                  <input className="text-[10px] border p-1 bg-transparent rounded" type="text" value={editFields.icon_class} onChange={e => setEditFields({...editFields, icon_class: e.target.value})} />
                  <div className="flex gap-1.5 mt-1">
                    <button onClick={() => handleUpdate(item.id, 'utility')} className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px]">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-2 py-0.5 bg-gray-400 text-white rounded text-[9px]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="font-bold text-[#eb6923]"><i className={`fa-solid ${item.icon_class || 'fa-link'} mr-1`}></i> {item.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.subtitle}</p>
                    <p className="text-[9px] text-blue-500 mt-1">Trigger: #/{item.page_path}</p>
                  </div>
                  <div className="flex gap-1 justify-end mt-2">
                    <button onClick={() => startEditing(item)} className="px-2 py-0.5 bg-blue-500 text-white text-[9px] rounded">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-2 py-0.5 bg-red-500 text-white text-[9px] rounded">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🖼️ MODULE 4: LOWER FEATURED ROWS CONSOLE */}
      <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-[#eb6923] border-b pb-2 dark:border-slate-800">4. Lower Featured Blueprints & Projects</h3>
        <form onSubmit={(e) => handleCreate('lower_block', e)} className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Blueprint Title Name" value={lowerForm.title} onChange={e => setLowerForm({...lowerForm, title: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Specs (e.g. 30x40 Sq.Ft)" value={lowerForm.subtitle} onChange={e => setLowerForm({...lowerForm, subtitle: e.target.value})} />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Target Component Page Routing Link" value={lowerForm.path} onChange={e => setLowerForm({...lowerForm, path: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Matching Filter Tag Layer" value={lowerForm.tag} onChange={e => setLowerForm({...lowerForm, tag: e.target.value})} required />
          <input className="px-3 py-2 rounded-xl border bg-transparent text-xs" type="text" placeholder="Site Location (e.g. Wankaner Office)" value={lowerForm.location} onChange={e => setLowerForm({...lowerForm, location: e.target.value})} />
          <input className="text-xs border rounded-xl p-1 file:text-xs" type="file" accept="image/*" onChange={e => setLowerForm({...lowerForm, file: e.target.files[0]})} required />
          <button type="submit" disabled={loading} className="col-span-2 py-2 bg-[#eb6923] text-white font-bold text-xs rounded-xl border-b-4 border-orange-700 active:translate-y-[2px] transition-all">PUBLISH FEATURED DECK</button>
        </form>
        <div className="space-y-2 mt-2">
          {cmsData.filter(i => i.section_type === 'lower_block').map(item => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border flex flex-col gap-2">
              {editingId === item.id ? (
                <div className="grid grid-cols-2 gap-2">
                  <input className="text-xs p-1 border rounded bg-transparent" type="text" value={editFields.title} onChange={e => setEditFields({...editFields, title: e.target.value})} />
                  <input className="text-xs p-1 border rounded bg-transparent" type="text" value={editFields.subtitle} onChange={e => setEditFields({...editFields, subtitle: e.target.value})} />
                  <input className="text-xs p-1 border rounded bg-transparent" type="text" value={editFields.page_path} onChange={e => setEditFields({...editFields, page_path: e.target.value})} />
                  <input className="text-xs p-1 border rounded bg-transparent" type="text" value={editFields.category_tag} onChange={e => setEditFields({...editFields, category_tag: e.target.value})} />
                  <input className="text-xs p-1 border rounded bg-transparent" type="text" value={editFields.location} onChange={e => setEditFields({...editFields, location: e.target.value})} />
                  <input className="text-xs p-1" type="file" onChange={e => setEditFields({...editFields, _file_ref: e.target.files[0]})} />
                  <div className="col-span-2 flex gap-2">
                    <button onClick={() => handleUpdate(item.id, 'lower_block')} className="px-3 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded-md">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-500 text-white font-bold text-[10px] rounded-md">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <img src={item.image_url} className="w-10 h-8 object-cover rounded" />
                    <div className="truncate">
                      <p className="font-bold truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400">Tag: {item.category_tag} | Link: #/{item.page_path}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(item)} className="px-2 py-1 bg-blue-500 text-white font-bold text-[10px] rounded-md">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-500 text-white font-bold text-[10px] rounded-md">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePortfolio;
