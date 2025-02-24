import React, { useState, useEffect } from "react";
import PaperCard from "./PaperCard";
import { useInView } from "react-intersection-observer";

const PaperList = () => {
  const [papers, setPapers] = useState([]); // Store papers
  const [page, setPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more papers exist
  const { ref, inView } = useInView(); // Detects when the last item is visible

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPapers(page);
    }
  }, [inView]);

  const fetchPapers = async (pageNumber) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/papers?page=${pageNumber}&limit=10`);
      const data = await res.json();

      if (Array.isArray(data.papers) && data.papers.length > 0) {
        setPapers((prev) => [...prev, ...data.papers]); // Append new data
        setPage(pageNumber + 1); // Increase page only if data exists
      } else {
        setHasMore(false); // No more papers, stop future API calls
      }
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Latest Papers</h1>
      <div className="flex flex-col space-y-4">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={hasMore ? ref : null} className="h-10 flex justify-center items-center">
        {loading && <p className="text-gray-500">Loading more...</p>}
        {!hasMore && <p className="text-gray-500">No more papers available.</p>}
      </div>
    </div>
  );
};

export default PaperList;
