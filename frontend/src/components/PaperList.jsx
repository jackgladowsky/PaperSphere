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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Papers</h1>
      
      <div className="grid gap-6">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
 
      {/* Infinite Scroll Trigger */}
      <div ref={hasMore ? ref : null} className="flex justify-center items-center py-8">
        {loading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        {!hasMore && <p className="text-gray-500 font-medium">You've reached the end</p>}
      </div>
    </div>
  );
};

export default PaperList;