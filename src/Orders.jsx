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
      setMyOrders(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (orderId) => {
    // PDF download hone par status 'Completed' kar dega
    await supabase.from('orders').update({ payment_status: 'Completed' }).eq('id', orderId);
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
                <span className={`status-pill ${order.payment_status?.toLowerCase()}`}>
                  {order.payment_status || 'Pending'}
                </span>
              </div>

              <div className="card-details">
                <p><strong>Size:</strong> {order.dimensions}</p>
                <p className="details-text">{order.details}</p>
              </div>

              <div className="card-actions">
                {/* Case 1: Payment Pending */}
                {(!order.payment_status || order.payment_status === 'Pending') && (
                  <div className="status-msg pending">Payment Pending</div>
                )}

                {/* Case 2: Payment Success, PDF Not Sent */}
                {order.payment_status === 'Success' && (
                  <div className="status-msg success">Working on your plan...</div>
                )}

                {/* Case 3: PDF Sent by Admin */}
                {order.payment_status === 'Sent' && order.pdf_url && (
                  <a 
                    href={order.pdf_url} 
                    className="download-btn" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => handleDownload(order.id)}
                  >
                    DOWNLOAD PDF PLAN
                  </a>
                )}

                {/* Case 4: Project Finished */}
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
      
