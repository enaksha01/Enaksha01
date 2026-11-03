import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

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
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#eb6923]/10 border border-[#eb6923]/30 flex items-center justify-center text-[#eb6923] animate-spin">
          <i className="fa-solid fa-spinner text-lg"></i>
        </div>
        <p className="text-xs font-mono text-slate-400">Loading Architectural Projects...</p>
      </div>
    );
  }

  return (
    <div className="orders-page text-left animate-fadeIn">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="section-title text-xl font-black text-white m-0 border-l-4 border-[#eb6923] pl-3">
            Active Architectural Orders
          </h3>
          <p className="text-[10px] font-mono text-slate-400 mt-1 pl-4">
            Live CAD drawings, milestones, and deliverable downloads
          </p>
        </div>
        <button
          onClick={fetchOrders}
          title="Refresh Projects"
          className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-[#eb6923] hover:border-[#eb6923]/40 flex items-center justify-center transition-all cursor-pointer tactile-click"
        >
          <i className="fa-solid fa-rotate text-xs"></i>
        </button>
      </div>

      <div className="orders-list space-y-4">
        {myOrders.length === 0 ? (
          <div className="p-10 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto text-slate-600">
              <i className="fa-solid fa-folder-open text-2xl"></i>
            </div>
            <h4 className="text-sm font-bold text-slate-300">No project orders found</h4>
            <p className="text-xs text-slate-500 font-mono max-w-xs mx-auto">
              Place a 2D layout or 3D elevation request from the Services tab to track drawings here.
            </p>
          </div>
        ) : (
          myOrders.map((order) => {
            const isCompleted = order.payment_status === 'Completed';
            const isSent = order.payment_status === 'Sent';
            const isSuccess = order.payment_status === 'Success';

            return (
              <div className="order-card-premium relative overflow-hidden group" key={order.id}>
                {/* Blueprint grid accent */}
                <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

                <div className="card-top relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="type-tag">{order.type}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                      PRJ #{order.id}
                    </span>
                  </div>
                  <button 
                    className="delete-btn-icon text-slate-500 hover:text-red-400 p-1 transition-colors" 
                    title="Remove Order"
                    onClick={() => handleCancel(order.id)}
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>

                {/* 3D Visual Milestone Tracking Bar */}
                <div className="tracking-bar-container relative z-10">
                  {/* Step 1: Payment */}
                  <div className={`track-step ${order.razorpay_payment_id ? 'done' : ''}`}>
                    <div className="dot">
                      {order.razorpay_payment_id ? <i className="fa-solid fa-check text-[10px]"></i> : '1'}
                    </div>
                    <span>Payment</span>
                  </div>

                  {/* Step 2: CAD Design */}
                  <div className={`track-step ${isSuccess || isSent || isCompleted ? 'active' : ''}`}>
                    <div className="dot">
                      {isSent || isCompleted ? <i className="fa-solid fa-check text-[10px]"></i> : '2'}
                    </div>
                    <span>CAD Design</span>
                  </div>

                  {/* Step 3: Delivery */}
                  <div className={`track-step ${isSent || isCompleted ? 'done' : ''}`}>
                    <div className="dot">
                      {isCompleted ? <i className="fa-solid fa-check text-[10px]"></i> : '3'}
                    </div>
                    <span>Delivery</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="card-details relative z-10 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono">Dimensions:</span>
                    <span className="font-mono font-bold text-white">{order.dimensions}</span>
                  </div>
                  <div className="details-text">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#eb6923] font-bold mb-0.5">
                      Client Brief:
                    </div>
                    {order.details}
                  </div>
                </div>

                {/* Action Messages & Buttons */}
                <div className="card-actions relative z-10">
                  {(!order.payment_status || order.payment_status === 'Pending') && (
                    <div className="status-msg pending py-2 text-amber-400 font-mono text-xs flex items-center justify-center gap-2">
                      <i className="fa-solid fa-clock"></i>
                      <span>Payment Verification Pending</span>
                    </div>
                  )}

                  {isSuccess && (
                    <div className="status-msg success py-2 text-[#ff8c42] font-mono text-xs flex items-center justify-center gap-2 bg-[#eb6923]/10 rounded-xl border border-[#eb6923]/20">
                      <i className="fa-solid fa-compass-drafting animate-spin"></i>
                      <span>Architect is drafting your blueprint...</span>
                    </div>
                  )}

                  {isSent && order.pdf_url && (
                    <a 
                      href={order.pdf_url} 
                      className="download-btn tactile-click flex items-center justify-center gap-2" 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={() => handleDownload(order.id)}
                    >
                      <i className="fa-solid fa-download"></i>
                      <span>DOWNLOAD CAD BLUEPRINT (PDF)</span>
                    </a>
                  )}

                  {isCompleted && (
                    <div className="completed-box">
                      <div className="status-msg completed text-emerald-400 font-mono text-xs flex items-center justify-center gap-1.5">
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Project Completed & Delivered</span>
                      </div>
                      {order.pdf_url && (
                        <a 
                          href={order.pdf_url} 
                          className="view-btn-small tactile-click cursor-pointer" 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <i className="fa-solid fa-eye"></i>
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
