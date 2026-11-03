import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  AlertTriangle, 
  X, 
  CheckCircle2 
} from 'lucide-react';

function LegalModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'refund', label: 'Refund & Cancellation', icon: RotateCcw },
    { id: 'shipping', label: 'Digital Delivery Policy', icon: Truck },
    { id: 'disclaimer', label: 'Architectural Disclaimer', icon: AlertTriangle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-text overflow-y-auto">
      {/* Dark frosted overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-[#ea580c] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Legal &amp; Compliance Portal
              </h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                e-Naksha Architectural Services &bull; Official Regulatory Policy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1.5 p-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar bg-slate-100/50 dark:bg-slate-950/30 shrink-0">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          
          {/* 1. TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                1. Architectural Service Engagement Terms
              </h4>
              <p>
                Welcome to <strong>e-Naksha</strong> (&quot;e-Naksha Portal&quot;). By commissioning a 2D floor layout plan or 3D elevation rendering service, you agree to be bound by the terms outlined below:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Scope of Work:</strong> e-Naksha provides digital architectural CAD layout plans, room dimensioning, Vaastu consultations, and photorealistic 3D facades based on the specifications, plot dimensions, and sketches provided by the client.
                </li>
                <li>
                  <strong>Client Inputs:</strong> The client is solely responsible for verifying the accuracy of plot boundaries, dimensions, orientation, and local municipal zoning criteria provided in the submission form.
                </li>
                <li>
                  <strong>Intellectual Property &amp; License:</strong> Upon full payment of the designated service fee, the client is granted a perpetual, non-exclusive license to use the delivered blueprints and renders for construction and municipal approval purposes.
                </li>
                <li>
                  <strong>Design Revisions:</strong> All standard 2D layout packages include one complimentary minor revision cycle within 7 days of initial draft delivery. Subsequent structural alterations or scope overhauls are subject to additional engineering fees.
                </li>
              </ul>
            </div>
          )}

          {/* 2. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                2. Client Data &amp; Blueprint Privacy Policy
              </h4>
              <p>
                e-Naksha treats all client plot measurements, floor diagrams, and personal contact information with strict architectural confidentiality:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Information Collection:</strong> We collect only essential contact data (Name, Email, Phone) and property blueprints necessary to draft and deliver your architectural layouts.
                </li>
                <li>
                  <strong>Site Photos &amp; Files:</strong> Uploaded site photos, sketches, and property documents are stored in private encrypted object storage and are accessed exclusively by assigned CAD draftsmen.
                </li>
                <li>
                  <strong>No 3rd Party Selling:</strong> Your data is never sold, leased, or disclosed to advertising networks or third-party real estate brokers.
                </li>
                <li>
                  <strong>Payment Security:</strong> All financial transactions are processed directly through RBI-compliant, PCI-DSS Level 1 certified payment gateways (Razorpay). e-Naksha does not store your credit card or UPI credentials.
                </li>
              </ul>
            </div>
          )}

          {/* 3. REFUND & CANCELLATION POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                3. Refund &amp; Cancellation Policy
              </h4>
              <p className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-mono">
                Mandatory disclosure for digital architectural customization services under Indian Consumer Protection E-Commerce Rules.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pre-Drafting Cancellations:</strong> If you request cancellation before our architectural team commences CAD drafting (within 2 hours of payment confirmation), a 100% full refund will be processed back to the original payment source within 5–7 business days.
                </li>
                <li>
                  <strong>In-Progress &amp; Delivered Orders:</strong> Architectural floor plans and 3D renderings are customized digital goods tailored specifically to your plot dimensions. Once CAD drafting has commenced or initial blueprint deliverables are generated, orders are non-refundable.
                </li>
                <li>
                  <strong>Correction Guarantee:</strong> If our draft deviates from the plot dimensions or Vaastu parameters originally submitted by the client, e-Naksha will rectify the drawing free of charge until compliant.
                </li>
              </ul>
            </div>
          )}

          {/* 4. DIGITAL SHIPPING & DELIVERY POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                4. Digital CAD Delivery Policy
              </h4>
              <p>
                All services offered on e-Naksha are 100% digital architectural assets:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Delivery Medium:</strong> Final CAD deliverables (high-resolution printable PDF sheets, DWG vector files upon request, and 4K ultra-HD 3D facade renders) are delivered directly inside the client&apos;s &quot;My Projects&quot; portal and emailed to the registered client address.
                </li>
                <li>
                  <strong>Turnaround Timeline:</strong> Standard 2D Vaastu floor plans are delivered within <strong>24 to 48 hours</strong> of form submission. Complex multi-story 3D elevations are delivered within 48 to 72 hours.
                </li>
                <li>
                  <strong>Shipping Costs:</strong> Zero shipping or logistics fee applies. All downloads are instant and digitally archived.
                </li>
              </ul>
            </div>
          )}

          {/* 5. ARCHITECTURAL DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                5. Engineering &amp; Municipal Disclaimer
              </h4>
              <p>
                e-Naksha drawings provide architectural conceptualization, room sizing, door/window positioning, and Vaastu orientation.
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ea580c]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Important Technical Notice</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Prior to ground excavation and casting of foundations/columns, clients must have the structural column schedule and soil load-bearing capacity reviewed by a locally licensed structural engineer in compliance with the local municipal corporation bylaws (e.g. NBC / BDA / DDA / JDA guidelines).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3 text-xs font-mono shrink-0">
          <span className="text-slate-500 dark:text-slate-400">
            Last updated: November 2026 &bull; Certified Compliant
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ea580c] text-white font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            Acknowledge &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default LegalModal;
