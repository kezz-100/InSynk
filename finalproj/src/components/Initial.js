import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Initial() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Video background */}
      <video
        src="/videos/63840-508272975.mp4"
        autoPlay
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: "0.4",
          position: "absolute",
          zIndex: -1, // Set video z-index lower than other elements
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "black",
          zIndex: 1, // z-index higher than video
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "20vw",
            marginBottom: "3rem",
          }}
        >
          InSynk
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <Link
            to="/login"
            className="btn btn-primary btn-lg "
            style={{ backgroundColor: "#007bff" }}
          >
            Log in
          </Link>
          <Link
            to="/registration"
            className="btn btn-secondary btn-lg"
            style={{ backgroundColor: "#343a40", marginLeft: "2rem" }}
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Animated bubbles */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Bubble 1 */}
        <div
          className="bubble bubble1"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            fontSize: "1.5rem",
            //background: "#e0e0e0"
            borderRadius: "50%",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p style={{ margin: 0 }}>
            Task Management and Assignment Made Simple with InSynk
          </p>
        </div>
        {/* Bubble 2 */}
        <div className="bubble bubble2"></div>
        {/* Bubble 3 */}
        <div
          className="bubble bubble3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            fontSize: "1.5rem",
            //background: "#e0e0e0"
            borderRadius: "50%",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p style={{ margin: 0 }}>Work Remotely Effortlessly</p>
        </div>
      </div>
    </div>
  );
}

export default Initial;
