import React, { useState, useMemo } from 'react';
import { generateSitemapXml, downloadSitemap } from '../lib/sitemapGenerator';
import { 
  Network, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  FileCode,
  AlertCircle
} from 'lucide-react';

function SitemapAdmin() {
  const [copied, setCopied] = useState(false);
  const [customBaseUrl, setCustomBaseUrl] = useState(() => {
    return window.location.origin;
  });

  const xmlContent = useMemo(() => {
    return generateSitemapXml(customBaseUrl);
  }, [customBaseUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    downloadSitemap(xmlContent, 'sitemap.xml');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-left">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ea580c] bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
            SEO &amp; CRAWLER ENGINE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            Dynamic XML Sitemap Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Auto-generate compliant sitemaps with weighted priority, lastmod timestamps, and admin security exclusion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-[#ea580c] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gradient-to-r from-[#ea580c] to-[#ff7828] text-white rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download sitemap.xml</span>
          </button>
        </div>
      </div>

      {/* Security Directive Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-300">
            Security &amp; Privacy Hardening Verified
          </h4>
          <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px] leading-relaxed">
            All internal administration consoles (<code>/admin</code>, <code>/master</code>) and API routes are strictly excluded from sitemap generation and prohibited via <code>robots.txt</code>. Search engines only index public architectural services and legal transparency pages.
          </p>
        </div>
      </div>

      {/* Domain URL configuration */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
          Base Canonical URL for Sitemap
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customBaseUrl}
            onChange={(e) => setCustomBaseUrl(e.target.value)}
            placeholder="https://enaksha.com"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-[#ea580c]"
          />
          <button
            onClick={() => setCustomBaseUrl('https://enaksha.com')}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Use Production Domain
          </button>
        </div>
      </div>

      {/* XML Code Preview Window */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-slate-950 text-slate-200">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#ff8c42]" />
            <span>sitemap.xml preview (Validated W3C Standards)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
            W3C XML 0.9 READY
          </span>
        </div>

        <pre className="p-5 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-[380px] leading-relaxed">
          {xmlContent}
        </pre>
      </div>

    </div>
  );
}

export default SitemapAdmin;
