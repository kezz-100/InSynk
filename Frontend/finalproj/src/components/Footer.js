// Import necessary dependencies and components
import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "transparent", // Set background color to transparent
        position: "fixed", // Set position to fixed
        bottom: 0, // Align the footer to the bottom of the viewport
        width: "100%", // Set the width to 100% to span the entire viewport
        textAlign: "center", // Center the content horizontally
        zIndex: 9999, // Set a high z-index to ensure the footer is always on top
      }}
    >
      <img
        src="images/icon.png"
        alt="Logo"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </footer>
  );
}

export default Footer;
