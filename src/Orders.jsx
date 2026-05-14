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
        [span_4](start_span).order('id', { ascending: false });[span_4](end_span)
      if (error) throw error;
      setMyOrders(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- YE SIRF EK HI ORDER DELETE KAREGA ---
  const handleCancel = async (orderId) => {
    if (window.confirm("Bhai, pakka sirf yahi order hatana hai?")) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId); [span_5](start_span)// targeted delete[span_5](end_span)
      
      if (error) alert(error.message);
      else fetchOrders(); 
    }
  };

  const handleDownload = async (orderId) => {
    [span_6](start_span)await supabase.from('orders').update({ payment_status: 'Completed' }).eq('id', orderId);[span_6](end_span)
    fetchOrders();
  };

  if (loading) return <div className="p-4 text-center">Loading Orders...</div>;

  return (
    <div className="orders-page">
      <h3 className="section-title">My Projects</h3>
      <div className="orders-list">
        {myOrders.length === 0 ? (
          <p className="text-center p-10 text-gray-500">No orders found.</p>
        ) : (
          myOrders.map((order) => (
            <div className="order-card-premium" key={order.id}>
              <div className="card-top">
                <span className="type-tag">{order.type}</span>
                {/* CANCEL BUTTON: Sirf ek order ke liye */}
                <button className="delete-btn-icon" onClick={() => handleCancel(order.id)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>

              {/* TRACKING BAR: Jo tune manga tha */}
              <div className="tracking-bar-container">
                <div className={`track-step ${order.razorpay_payment_id ? 'done' : ''}`}>
                  <div className="dot">1</div>
                  <span>Payment</span>
                </div>
                <div className={`track-step ${order.payment_status === 'Success' || order.payment_status === 'Sent' ? 'active' : ''}`}>
                  <div className="dot">2</div>
                  <span>Design</span>
                </div>
                <div className={`track-step ${order.payment_status === 'Sent' ? 'active' : ''}`}>
                  <div className="dot">3</div>
                  <span>Delivery</span>
                </div>
              </div>

              <div className="card-details">
                <p><strong>Size:</strong> {order.dimensions}</p>
                <p className="details-text">{order.details}</p>
              </div>

              <div className="card-actions">
                {(!order.payment_status || order.payment_status === 'Pending') && (
                  <div className="status-msg pending">Payment Pending</div>
                )}

                {order.payment_status === 'Success' && (
                  <div className="status-msg success">Working on your plan...</div>
                )}

                {order.payment_status === 'Sent' && order.pdf_url && (
                  <a href={order.pdf_url} className="download-btn" target="_blank" rel="noreferrer" onClick={() => handleDownload(order.id)}>
                    DOWNLOAD PDF PLAN
                  </a>
                )}

                {order.payment_status === 'Completed' && (
                  <div className="status-msg completed">Project Completed ✅</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
