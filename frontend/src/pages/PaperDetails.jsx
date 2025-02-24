import React from "react";
import { useParams } from "react-router-dom";

const PaperDetails = () => {
  const { id } = useParams(); // Get paper ID from URL

  return (
    <div className="text-center text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold">Paper Details (ID: {id})</h1>
      <p>Show abstract, summary, and metadata here...</p>
    </div>
  );
};

export default PaperDetails;
