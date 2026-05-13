import React from 'react';

const LayoutForm = ({ handleOrderSubmit, setFormType, uploading }) => {
  return (
    <div className="form-container">
      <button className="back-btn" onClick={() => setFormType(null)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      <h2 className="form-title">2D Layout Requirements</h2>
      
      <form onSubmit={handleOrderSubmit}>
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

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? "Saving Details..." : "CONFIRM 2D ORDER"}
        </button>
      </form>
    </div>
  );
};

export default LayoutForm;
