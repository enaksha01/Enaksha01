import React from 'react';

const ElevationForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  return (
    <div className="form-container">
      <button className="back-btn" onClick={() => setFormType(null)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      <h2 className="form-title">3D Elevation Details</h2>
      
      <form onSubmit={handleOrderSubmit}>
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

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "Uploading Front View..." : "CONFIRM 3D ORDER"}
        </button>
      </form>
    </div>
  );
};

export default ElevationForm;
