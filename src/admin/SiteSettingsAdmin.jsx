import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../lib/settingsStore';
import { 
  Sliders, 
  Megaphone, 
  Type, 
  Check, 
  RotateCcw, 
  Globe, 
  Phone, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';

function SiteSettingsAdmin() {
  const { settings, updateSettings, defaultSettings } = useSiteSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert("Error saving settings to cloud: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset all settings to studio defaults? This will sync to all devices.")) {
      setSaving(true);
      try {
        setFormData({ ...defaultSettings });
        await updateSettings(defaultSettings);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } catch (err) {
        alert("Error resetting settings: " + (err.message || err));
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-left">
      
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
            STUDIO CONTROL MATRIX
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            Header Offer Banner, Slogan &amp; Site Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Configure header offers on/off, slogan, branding, and contact channels. All changes sync to Supabase and broadcast live across all visitor devices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Synced Live to All Devices!
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to Defaults"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-red-500 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* 📢 SECTION 1: HEADER OFFER / ANNOUNCEMENT BAR TOGGLE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-[#ea580c] flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Header Top Announcement Bar (Offer 2026)
                </h3>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Turn ON when promotions are active, or turn OFF to keep the header minimal.
                </p>
              </div>
            </div>

            {/* Live Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={formData.showAnnouncement} 
                onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ea580c]"></div>
              <span className="ml-2.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {formData.showAnnouncement ? 'DISPLAY ON' : 'HIDDEN'}
              </span>
            </label>
          </div>

          {formData.showAnnouncement && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Offer Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.announcementBadge}
                    onChange={(e) => handleChange('announcementBadge', e.target.value)}
                    placeholder="e.g. OFFER 2026, FESTIVE DEAL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Announcement Headline Text
                  </label>
                  <input
                    type="text"
                    value={formData.announcementText}
                    onChange={(e) => handleChange('announcementText', e.target.value)}
                    placeholder="e.g. ⚡ 2D Vaastu Floor Plans @ ₹999..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Secondary Announcement Trust Notes (Desktop View)
                </label>
                <input
                  type="text"
                  value={formData.announcementSubText}
                  onChange={(e) => handleChange('announcementSubText', e.target.value)}
                  placeholder="e.g. 24/7 Architect Support • 100% Vaastu Verified"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 🏛️ SECTION 2: BRANDING & SLOGAN ("SKETCH YOUR DREAM") */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Studio Slogan &amp; Identity
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Official tagline rendered under the logo in header and footer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Official Slogan (Header Subtitle)
              </label>
              <input
                type="text"
                value={formData.siteSlogan}
                onChange={(e) => handleChange('siteSlogan', e.target.value)}
                placeholder="Sketch Your Dream"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
                required
              />
              <span className="text-[9px] font-mono text-slate-400 block">
                Default: &quot;Sketch Your Dream&quot;
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Brand Identity
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                placeholder="e-Naksha"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
                required
              />
              <div className="mt-1 flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] font-mono text-slate-400">Live Typography:</span>
                <span className="text-base font-black leading-none">
                  <span className="text-[#ea580c]">e</span>
                  <span className="text-slate-400 px-0.5">-</span>
                  <span className="text-[#2563eb] dark:text-[#38bdf8]">Naksha</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📞 SECTION 3: CONTACT & CHANNELS */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Contact Channels &amp; Support Hotline
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Shown to clients in order status, support strips, and legal policies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Architect Support Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Official Client Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="support@enaksha.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c] font-mono"
              />
            </div>
          </div>
        </div>

        {/* 🔍 SECTION 4: SEO METADATA */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Search Engine Optimization (SEO) &amp; Social Meta
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Injected into head tags for Google indexing, WhatsApp, and social share previews.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Page Title Tag (&lt;title&gt;)
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Meta Description Tag
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-[#ea580c] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#ea580c] via-[#ff7828] to-[#ea580c] text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'SYNCING TO CLOUD...' : 'SAVE & SYNC TO ALL DEVICES'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default SiteSettingsAdmin;
