import "./App.css";

import RouterPage from "./components/RouterPage";

function App() {
  return (
    <div className="App">
      <RouterPage />
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Registration />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

export default App;
