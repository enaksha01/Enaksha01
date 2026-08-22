import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Apna supabase path verify kar lena

const LayoutForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  // 1. Price store karne ke liye state (Default 999)
  const [layoutPrice, setLayoutPrice] = useState(999);

  // 2. Supabase se live price fetch karne ka effect
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('service_prices')
          .select('price')
          .eq('service_name', '2d') // 2D Layout ke liye '2d' use kar rahe hain
          .single();
          
        if (data && !error) {
          setLayoutPrice(data.price);
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
      <h2 className="form-title">2D Layout Requirements</h2>
      
      <form onSubmit={(e) => handleOrderSubmit(e, layoutPrice)}>

        <div className="input-group">
          <label>Plot Dimensions (e.g. 30x50 ft)</label>
          <input name="plotSize" type="text" className="form-input" placeholder="Enter Size" required />
        </div>

        <div className="input-group">
          <label>Plot Facing</label>
          <select name="facing" className="form-input">
            <option>East</option><option>West</option><option>North</option><option>South</option>
          </select>
        </div>

        <div className="input-group">
          <label>Washroom Preference</label>
          <select name="washroom" className="form-input">
            <option value="combined">Combined (Toilet + Bath)</option>
            <option value="separate">Separate Toilet & Bath</option>
            <option value="attached">Attached to Bedroom</option>
          </select>
        </div>

        <div className="input-group">
          <label>Additional Details (BHK, Vaastu, etc.)</label>
          <textarea name="details" className="form-input" style={{height:'80px'}} placeholder="Describe your dream home..." required></textarea>
        </div>

        <div className="input-group">
          <label>Upload Rough Sketch / Site Photo</label>
          <input name="siteFile" type="file" className="form-input" accept="image/*" required />
        </div>

        {/* 3. Live Price Dikhane ka section */}
        <div className="text-center py-3 mb-2 bg-orange-50 rounded-lg border border-orange-100">
          <span className="font-bold text-lg text-[#eb6923]">
            Total Service Price: ₹{layoutPrice}
          </span>
        </div>

        {/* Submit button me bhi price add kiya hua hai */}
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "Saving Details..." : `CONFIRM 2D ORDER (₹${layoutPrice})`}
        </button>
      </form>
    </div>
  );
};

export default LayoutForm;
