import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.css";
import Events from "./components/Events";
import Sidebar from "./components/Sidebar";
import Tickets from "./components/Tickets";
import Home from "./components/Home";
import Topbar from "./components/Topbar";
import Help from "./components/Help";
import Settings from "./components/Settings";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/your-events" element={<Events />} />
          <Route path="/your-tickets" element={<Tickets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
