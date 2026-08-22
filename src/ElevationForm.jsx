import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Apna supabase ka path check kar lena

const ElevationForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  // 1. Price store karne ke liye state
  const [elevationPrice, setElevationPrice] = useState(2499); // Default price

  // 2. Supabase se live price fetch karne ka effect
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('service_prices')
          .select('price')
          .eq('service_name', '3d') // 3D Elevation ke liye '3d' match karega
          .single();
          
        if (data && !error) {
          setElevationPrice(data.price);
        }
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrice();
  }, []);

  return (
    <div className="form-container">
      <button className="back-btn" onClick={() => setFormType(null)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      <h2 className="form-title">3D Elevation Details</h2>
      
      <form onSubmit={(e) => handleOrderSubmit(e, elevationPrice)}>

        <div className="input-group">
          <label>Plot Dimensions</label>
          <input name="plotSize" type="text" className="form-input" placeholder="Enter Size" required />
        </div>

        <div className="input-group">
          <label>Style Preference</label>
          <select name="details" className="form-input">
            <option>Modern / Minimalist</option>
            <option>Traditional / Classic</option>
            <option>Luxury / Glass Work</option>
            <option>Box Type Design</option>
          </select>
        </div>

        <div className="input-group">
          <label>Upload Site Photo (Front View)</label>
          <input name="siteFile" type="file" className="form-input" accept="image/*" required />
        </div>

        {/* 3. Live Price Dikhane ka section */}
        <div className="text-center py-3 mb-2 bg-orange-50 rounded-lg border border-orange-100">
          <span className="font-bold text-lg text-[#eb6923]">
            Total Service Price: ₹{elevationPrice}
          </span>
        </div>

        {/* Button me bhi price dikha sakte hain (Optional, par acha lagta hai) */}
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "Uploading Front View..." : `CONFIRM ORDER (₹${elevationPrice})`}
        </button>
      </form>
    </div>
  );
};

export default ElevationForm;
