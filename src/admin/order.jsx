import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Apna supabase path check kar lena

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  // Price inputs ke liye state
  const [priceInputs, setPriceInputs] = useState({ '2d': '', '3d': '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false }); // Naye order upar dikhenge
      
      if (ordersError) throw ordersError;
      
      // 2. Fetch Prices
      const { data: pricesData, error: pricesError } = await supabase
        .from('service_prices')
        .select('*');
        
      if (pricesError) throw pricesError;

      setOrders(ordersData || []);
      setPrices(pricesData || []);
      
      // Price inputs me default value set karna
      const pInputs = {};
      pricesData?.forEach(p => {
        pInputs[p.service_name] = p.price;
      });
      setPriceInputs(pInputs);

    } catch (error) {
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 💰 PRICE UPDATE FUNCTION
  const handleUpdatePrice = async (serviceName) => {
    const newPrice = priceInputs[serviceName];
    if (!newPrice) return alert("Please enter a valid price");

    try {
      const { error } = await supabase
        .from('service_prices')
        .update({ price: newPrice })
        .eq('service_name', serviceName);

      if (error) throw error;
      alert(`${serviceName.toUpperCase()} price updated to ₹${newPrice} successfully!`);
      fetchData(); // Refresh data
    } catch (error) {
      alert("Error updating price: " + error.message);
    }
  };

    // 📤 UPLOAD FINAL PLAN FUNCTION
  const handleUploadFinalPlan = async (orderId, file) => {
    if (!file) return;
    
    setUploadingId(orderId);
    try {
      const fileName = `final_plans/order_${orderId}_${Date.now()}_${file.name}`;
      
      // 1. File Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      // 3. Update Order Database with PDF URL AND Automatic Complete Status
      const { error: dbError } = await supabase
        .from('orders')
        .update({ 
          pdf_url: urlData.publicUrl,
          payment_status: 'Completed' // 👈 Yahan se ab automatic 'complete' ho jayega!
        })
        .eq('id', orderId);

      if (dbError) throw dbError;

      alert("Final Plan uploaded successfully! Client can now download it.");
      fetchData(); // Refresh UI
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };


  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fadeIn">
      
      {/* 💰 SECTION 1: MANAGE PRICING */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
          <i className="fa-solid fa-indian-rupee-sign mr-2 text-[#eb6923]"></i> Manage Service Prices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prices.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800">
              <span className="font-bold text-sm uppercase w-16">{p.service_name}:</span>
              <input 
                type="number" 
                value={priceInputs[p.service_name] || ''}
                onChange={(e) => setPriceInputs({...priceInputs, [p.service_name]: e.target.value})}
                className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-sm outline-none focus:border-[#eb6923]"
              />
              <button 
                onClick={() => handleUpdatePrice(p.service_name)}
                className="bg-[#eb6923] text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 SECTION 2: CLIENT ORDERS */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
          <i className="fa-solid fa-clipboard-list mr-2 text-[#eb6923]"></i> Client Orders
        </h2>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 bg-white dark:bg-slate-900 p-8 rounded-2xl">No orders received yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
                
                {/* Client & Order Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-md">ID: #{order.id}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${order.pdf_url ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.pdf_url ? 'Completed' : 'Pending'}
                    </span>
                    <span className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-md uppercase">{order.type}</span>
                  </div>
                  
                  <p className="text-sm font-bold mt-2"><i className="fa-regular fa-envelope mr-1"></i> {order.user_email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><i className="fa-solid fa-ruler-combined mr-1"></i> Size: {order.dimensions}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><i className="fa-solid fa-align-left mr-1"></i> Details: {order.details}</p>
                  
                  <a href={order.file_url} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-[#eb6923] hover:underline">
                    <i className="fa-solid fa-download mr-1"></i> View Client's Uploaded File
                  </a>
                </div>

                {/* Action: Upload Final Plan */}
                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-4 min-w-[200px]">
                  {order.pdf_url ? (
                    <div className="text-center space-y-2">
                      <p className="text-green-500 font-bold text-sm"><i className="fa-solid fa-check-circle"></i> Plan Delivered</p>
                      <a href={order.pdf_url} target="_blank" rel="noreferrer" className="block text-xs bg-gray-100 dark:bg-slate-800 py-2 rounded-lg text-center font-bold">
                        View Uploaded Plan
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Deliver Final Plan (PDF/Img)</label>
                      <input 
                        type="file" 
                        id={`upload-${order.id}`}
                        className="hidden"
                        onChange={(e) => handleUploadFinalPlan(order.id, e.target.files[0])}
                      />
                      <label 
                        htmlFor={`upload-${order.id}`}
                        className={`block text-center text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-all ${uploadingId === order.id ? 'bg-gray-400 text-white pointer-events-none' : 'bg-[#eb6923] text-white shadow-md active:scale-95'}`}
                      >
                        {uploadingId === order.id ? 'Uploading...' : 'Upload Plan & Complete'}
                      </label>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminOrders;
