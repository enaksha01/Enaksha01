import React from 'react';

function App() {
  const styles = {
    app: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    header: {
      width: "100%",
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "15px 0",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    },
    container: {
      width: "90%",
      maxWidth: "400px",
      backgroundColor: "white",
      marginTop: "30px",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },
    title: {
      color: "#e67e22",
      fontSize: "22px",
      textAlign: "center",
      marginBottom: "20px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#34495e",
      marginBottom: "5px"
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #dcdde1",
      boxSizing: "border-box"
    },
    button: {
      width: "100%",
      padding: "15px",
      backgroundColor: "#e67e22",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s"
    },
    footer: {
      marginTop: "auto",
      padding: "20px",
      fontSize: "12px",
      color: "#7f8c8d"
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h2 style={{margin: 0}}>E-NAKSHA</h2>
      </header>

      <div style={styles.container}>
        <h3 style={styles.title}>Project Specifications</h3>
        
        <form onSubmit={(e) => { e.preventDefault(); alert("Redirecting to Payment Mode..."); }}>
          <label style={styles.label}>Plot Dimensions (ft)</label>
          <input type="text" placeholder="e.g. 25 x 50" style={styles.input} required />

          <label style={styles.label}>Plot Orientation</label>
          <select style={styles.input}>
            <option>East Facing</option>
            <option>West Facing</option>
            <option>North Facing</option>
            <option>South Facing</option>
          </select>

          <label style={styles.label}>BHK Requirement</label>
          <input type="text" placeholder="e.g. 2BHK, 3BHK" style={styles.input} required />

          <label style={styles.label}>Floors</label>
          <select style={styles.input}>
            <option>Ground Floor Only</option>
            <option>G + 1 Floor</option>
            <option>G + 2 Floors</option>
          </select>

          <button type="submit" style={styles.button}>
            PROCEED TO PAYMENT
          </button>
        </form>
      </div>

      <footer style={styles.footer}>
        © 2026 E-Naksha Project | Professional Design Services
      </footer>
    </div>
  );
}

export default App;
