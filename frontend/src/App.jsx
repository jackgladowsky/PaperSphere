import React from "react";
import "./styles.css"; // Ensure correct path
import PaperList from "./components/PaperList";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PaperList />
    </div>
  );
}

export default App;
