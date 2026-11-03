import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { 
  RefreshCw, 
  FolderOpen, 
  Trash2, 
  Check, 
  Clock, 
  Compass, 
  Download, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

const Orders = ({ user }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });
      if (error) throw error;
      setMyOrders(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this project order?")) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) alert(error.message);
      else fetchOrders(); 
    }
  };

  const handleDownload = async (orderId) => {
    try {
      await supabase
        .from('orders')
        .update({ payment_status: 'Completed' })
        .eq('id', orderId);
      
      fetchOrders();
    } catch (err) {
      console.error("Download update failed:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ea580c] animate-spin">
          <RefreshCw className="w-5 h-5" />
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading Architectural Projects...</p>
      </div>
    );
  }

  return (
    <div className="orders-page text-left animate-fadeIn max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h3 className="section-title text-xl sm:text-2xl font-black text-slate-900 dark:text-white m-0">
            Active Architectural Orders
          </h3>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Live CAD drawings, milestones, and deliverable downloads
          </p>
        </div>
        <button
          onClick={fetchOrders}
          title="Refresh Projects"
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-[#ea580c] flex items-center justify-center transition-all cursor-pointer tactile-click"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="orders-list space-y-4">
        {myOrders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-600">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No project orders found</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono max-w-sm mx-auto">
              Place a 2D layout or 3D elevation request from the Services tab to track drawings here.
            </p>
          </div>
        ) : (
          myOrders.map((order) => {
            const isCompleted = order.payment_status === 'Completed';
            const isSent = order.payment_status === 'Sent';
            const isSuccess = order.payment_status === 'Success';

            return (
              <div className="order-card-premium relative overflow-hidden group shadow-sm hover:shadow-xl transition-all" key={order.id}>
                <div className="card-top relative z-10 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="type-tag">{order.type}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-black/40 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
                      PRJ #{order.id}
                    </span>
                  </div>
                  <button 
                    className="delete-btn-icon text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer" 
                    title="Remove Order"
                    onClick={() => handleCancel(order.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 3D Visual Milestone Tracking Bar */}
                <div className="tracking-bar-container relative z-10">
                  {/* Step 1: Payment */}
                  <div className={`track-step ${order.razorpay_payment_id ? 'done' : ''}`}>
                    <div className="dot">
                      {order.razorpay_payment_id ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </div>
                    <span>Payment</span>
                  </div>

                  {/* Step 2: CAD Design */}
                  <div className={`track-step ${isSuccess || isSent || isCompleted ? 'active' : ''}`}>
                    <div className="dot">
                      {isSent || isCompleted ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </div>
                    <span>CAD Drafting</span>
                  </div>

                  {/* Step 3: Delivery */}
                  <div className={`track-step ${isSent || isCompleted ? 'done' : ''}`}>
                    <div className="dot">
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : '3'}
                    </div>
                    <span>Delivery</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="card-details relative z-10 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Dimensions:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{order.dimensions}</span>
                  </div>
                  <div className="details-text">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#ea580c] font-bold mb-0.5">
                      Client Brief:
                    </div>
                    {order.details}
                  </div>
                </div>

                {/* Action Messages & Buttons */}
                <div className="card-actions relative z-10">
                  {(!order.payment_status || order.payment_status === 'Pending') && (
                    <div className="status-msg pending py-2 text-amber-500 font-mono text-xs flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Payment Verification Pending</span>
                    </div>
                  )}

                  {isSuccess && (
                    <div className="status-msg success py-2 text-[#ea580c] font-mono text-xs flex items-center justify-center gap-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <Compass className="w-4 h-4 animate-spin" />
                      <span>Architect is drafting your blueprint...</span>
                    </div>
                  )}

                  {isSent && order.pdf_url && (
                    <a 
                      href={order.pdf_url} 
                      className="download-btn tactile-click flex items-center justify-center gap-2 cursor-pointer" 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={() => handleDownload(order.id)}
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD CAD BLUEPRINT (PDF)</span>
                    </a>
                  )}

                  {isCompleted && (
                    <div className="completed-box flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      <div className="status-msg completed text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Project Completed &amp; Delivered</span>
                      </div>
                      {order.pdf_url && (
                        <a 
                          href={order.pdf_url} 
                          className="view-btn-small tactile-click cursor-pointer" 
                          target="_blank" 
                          rel="noreferrer" 
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VIEW FINAL DRAWING</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
