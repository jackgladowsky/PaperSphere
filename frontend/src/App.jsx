import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PaperList from "./components/PaperList";
import SearchPage from "./pages/SearchPage";
import PaperDetails from "./pages/PaperDetails";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      {/* Full-height background */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        
        {/* Center the main content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PaperList />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/paper/:id" element={<PaperDetails />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
