import AdminPage from "../pages/AdminPage";
import Verify from "../pages/Verify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const RouteManager = () => {
  // Example authentication logic
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/verify/:codigo" element={<Verify />} />
        <Route path="/adminpage" element={<AdminPage />} />
        {/* 404 Not Found */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default RouteManager;
