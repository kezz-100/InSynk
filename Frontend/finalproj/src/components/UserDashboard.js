// Import necessary dependencies and components
import React, { useState, useEffect, useRef } from "react";
import UserHeader from "./UserHeader";
import Footer from "./Footer";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faLaughBeam,
  faLaughWink,
} from "@fortawesome/free-solid-svg-icons";
import { Fade } from "react-reveal";
import axios from "axios";

// Custom 3D component representing a rotating cube
function CubeWithWords() {
  const cubeRef = useRef();

  // Rotate the cube on each frame
  useFrame(() => {
    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={cubeRef}>
      {/* Main cube */}
      <mesh scale={[5, 5, 5]}>
        <boxGeometry args={[1, 1, 1]} />
        {/* Main material */}
        <meshStandardMaterial color="#0072ff" />
        {/* Edge material */}
        <meshBasicMaterial color="black" wireframe />
      </mesh>
    </group>
  );
}

// PlainCard component
function PlainCard({ totalTasks, completedTasks }) {
  return (
    <Fade bottom>
      <div
        style={{
          width: "80%",
          margin: "auto",
          boxShadow: "0px 4px 8px rgba(2, 2, 2, 2)",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <div style={{ flex: "1", padding: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Total Tasks</h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "120px",
              fontWeight: "bold",
            }}
          >
            {totalTasks}
          </p>
        </div>
        <div style={{ flex: "1", padding: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Completed Tasks</h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "120px",
              fontWeight: "bold",
            }}
          >
            {completedTasks}
          </p>
        </div>
      </div>
    </Fade>
  );
}

export default function AdminDashboard() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    fetchTotalTasks();
  }, []);

  const fetchTotalTasks = () => {
    // Fetch total tasks from the database
    axios
      .get("https://localhost:7089/api/Tasks/TasksList")
      .then((response) => {
        const data = response.data;
        if (data.statusCode === 200) {
          setTotalTasks(data.listTasks.length);
          const completed = data.listTasks.filter(
            (task) => task.isCompleted === 1
          );
          setCompletedTasks(completed.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching total tasks:", error);
      });
  };

  // State variables for active testimonial index and visible sections
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  //const [visibleSections, setVisibleSections] = useState([]);

  // Testimonials data
  const testimonials = [
    "The best task management system ever! InSynk allows a clear insight of tasks for the day. Why go anywhere else when you have everything you need here.",

    "So easy to use and understand. My productivity increased so much with InSynk. Navigation is clear, everything is perfect, how is this app free!",

    "My go-to every morning to know what tasks I have for the day. Everyone should be using it InSynk has allowed my projects to meet more deadlines swiftly.",
  ];

  // Automatic testimonial change every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveTestimonialIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  // Function to toggle visibility of sections
  const toggleVisibility = (section) => {
    if (visibleSections.includes(section)) {
      setVisibleSections(visibleSections.filter((item) => item !== section));
    } else {
      setVisibleSections([...visibleSections, section]);
    }
  };
*/

  return (
    <>
      <UserHeader />
      <br />

      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <h3>{"InSynk"}</h3>
      </div>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CubeWithWords />
        <OrbitControls
          enableDamping={true}
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.5}
        />
      </Canvas>
      <PlainCard totalTasks={totalTasks} completedTasks={completedTasks} />
      <Fade bottom>
        <div
          style={{
            width: "80%",
            margin: "auto",
            boxShadow: "0px 4px 8px rgba(2, 2, 2, 2)",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //marginBottom: "150px",
          }}
        >
          <div style={{ flex: "1", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}> Overview</h2>

            <p>
              At the heart of our project lies a commitment to revolutionize
              teamwork and task management. With 'InSynk,' we aim to empower
              teams to seamlessly collaborate, innovate, and achieve their goals
              with unparalleled efficiency. By integrating intuitive task
              creation, streamlined assignment processes, and real-time progress
              tracking, we're paving the way for enhanced productivity and
              communication. Join us on this journey to unlock the full
              potential of your team and elevate your project management
              experience to new heights.
            </p>
            <p>Key features include:</p>

            <ul>
              <li>
                Task Creation: Create tasks with detailed descriptions and due
                dates.
              </li>
              <li>
                Assignment: Tasks can be assigned to specific team members,
                facilitating clear accountability.
              </li>
              <li>
                Progress Tracking: Real-time progress tracking allows users to
                monitor task status and completion. Allow your team members to
                delete the task only once its been finished and verified by you.
              </li>
              <li>
                Notifications: Automatic notifications to keep team members
                informed, notfications applied at every main event so your team
                won't miss a thing.
              </li>
            </ul>
          </div>
          <div style={{ flex: "1" }}>
            <img
              src="/images/hands-2178566_1280.jpg"
              alt="Overview Image"
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
            />
          </div>
        </div>
      </Fade>

      <Fade bottom>
        <div
          style={{
            textAlign: "center",
            marginTop: "350px",
            //marginBottom: "250px",
          }}
        >
          {/* Testimonials Card */}
          <div
            className="testimonial-card"
            style={{
              width: "80%", // Adjust the width of the card
              margin: "auto", // Center the card horizontally
              boxShadow: "0px 4px 8px rgba(2, 2, 2, 2)", // Add shadow for depth
              borderRadius: "10px", // Smooth edges
              overflow: "hidden", // Ensure smooth edges are applied
              marginTop: "30px", // Adjust margin as needed
              display: "flex", // Use flexbox
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically
              marginBottom: "150px",
            }}
          >
            <div className="testimonial-content" style={{ padding: "20px" }}>
              <h2 style={{ textAlign: "center" }}>Testimonials</h2>{" "}
              <img
                src="/images/quoteopen.png"
                alt="Opening Quote"
                className="quote-image"
                style={{ width: "100px" }}
              />
              <p>{testimonials[activeTestimonialIndex]}</p>
              <img
                src="/images/quoteclosed.png"
                alt="Closing Quote"
                className="quote-image"
                style={{ width: "100px" }}
              />
              {/* Font Awesome Icons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <FontAwesomeIcon
                  icon={faSmile}
                  style={{ fontSize: "2em", marginRight: "10px" }}
                />
                <FontAwesomeIcon
                  icon={faLaughBeam}
                  style={{ fontSize: "2em", marginRight: "10px" }}
                />
                <FontAwesomeIcon
                  icon={faLaughWink}
                  style={{ fontSize: "2em" }}
                />
              </div>
            </div>
          </div>
          <Fade bottom>
            <div
              style={{
                width: "80%",
                margin: "auto",
                boxShadow: "0px 4px 8px rgba(2, 2, 2, 2)",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "350px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "450px",
              }}
            >
              <div style={{ flex: "1", height: "100%" }}>
                <img
                  src="/images/IMG_1521.jpg"
                  alt="Profile Image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div style={{ flex: "1", padding: "20px" }}>
                <h3 style={{ textAlign: "center" }}>Profile Card</h3>
                <p style={{ textAlign: "center" }}>
                  Founder of InSynk here, my name is Kenan Wilson, a software
                  engineering student in my final year. This was my final
                  project and behind the thought for this service of InSynk is
                  to ultimately make team members better aware of their tasks
                  for the day. I find myself spending a huge portion of my time
                  thinking about what I'm going to get done for the day, with
                  InSynk this can better manage team members of your project
                  knowing rest assured they know exactly what they need to
                  complete. InSynk wants nothing more than to see your projects
                  succeed and be completed prompty. I hope you see the vision
                  with this service and have a wonderful experiece using InSynk.
                  I took a lot of time and effort to produce this if you cant
                  see already. Have fun.
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </Fade>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          fontSize: "2em",
        }}
        onClick={scrollToTop}
      >
        &#9650;
      </div>

      <Footer />
    </>
  );
}
