import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Events from "./components/Events";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import Tickets from "./components/Tickets";
import Home from "./components/Home";
import Topbar from "./components/Topbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/your-events" element={<Events />} />
          <Route path="/your-tickets" element={<Events />} />
          <Route path="/Settings" element={<Events />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
