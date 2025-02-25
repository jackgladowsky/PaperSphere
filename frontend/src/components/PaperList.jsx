import React, { useState, useEffect } from "react";
import PaperCard from "./PaperCard";
import { useInView } from "react-intersection-observer";
import { Search, Filter, X, ChevronDown } from "lucide-react";

const PaperList = () => {
  const [papers, setPapers] = useState([]); // Store papers
  const [page, setPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more papers exist
  const { ref, inView } = useInView(); // Detects when the last item is visible
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [summary, setSummary] = useState("default");
  
  // Sample categories - replace with actual categories from your database
  const categories = [
    { value: "", label: "All Categories" },
    { value: "cs.CL", label: "Computation and Language" },
    { value: "cs.CV", label: "Computer Vision" },
    { value: "cs.AI", label: "Artificial Intelligence" },
    { value: "cs.LG", label: "Machine Learning" }
  ];
  
  // Sample date ranges
  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  const summaryTypes = [
    {value: "default", label: "Default Summaries"},
    {value: "highschool_students", label: "High School Students"},
    {value: "undergraduate_students", label: "Undergraduate Students"},
    {value: "graduate_students", label: "Graduate Students"},
    {value: "researchers", label: "Researchers"}
  ];

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPapers(page);
    }
  }, [inView]);

  // Reset and fetch papers when filters change
  useEffect(() => {
    // Only reset if we've already loaded some papers
    if (papers.length > 0) {
      setPapers([]);
      setPage(1);
      setHasMore(true);
      fetchPapers(1);
    }
  }, [selectedCategory, dateRange]);

  const fetchPapers = async (pageNumber) => {
    if (loading) return;
    setLoading(true);
    try {
      // Add filter parameters to API call
      let url = `http://localhost:8000/papers?page=${pageNumber}&limit=10`;
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      if (dateRange !== "all") {
        url += `&date_range=${dateRange}`;
      }
      
      const res = await fetch(url);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Reset papers and fetch with search term
      setPapers([]);
      setPage(1);
      setHasMore(true);
      // This is a placeholder - you'll need to add search capability to your API
      fetchPapers(1);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setDateRange("all");
    setSummary("default");
    setSearchTerm("");
    setPapers([]);
    setPage(1);
    setHasMore(true);
    fetchPapers(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Papers</h1> */}
      
      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <form onSubmit={handleSearch} className="relative flex-grow mr-2">
            <input
              type="text"
              placeholder="Search papers..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </form>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
            <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Expandable Filter Options */}
        {showFilters && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary Level</label>
                <select
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {summaryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            </div>
            
            {(selectedCategory || dateRange !== "all" || summary !== "default") && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Active filters:
                  {selectedCategory && (
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {categories.find(c => c.value === selectedCategory)?.label}
                    </span>
                  )}
                  {dateRange !== "all" && (
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {dateRanges.find(d => d.value === dateRange)?.label}
                    </span>
                  )}
                  {summary !== "default" && (
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {summaryTypes.find(d => d.value === summary)?.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
     
      <div className="grid gap-6">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
 
      {/* No Results Message */}
      {papers.length === 0 && !loading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">No papers found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
 
      {/* Infinite Scroll Trigger */}
      <div ref={hasMore ? ref : null} className="flex justify-center items-center py-8">
        {loading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        {!hasMore && papers.length > 0 && <p className="text-gray-500 font-medium">You've reached the end</p>}
      </div>
    </div>
  );
};

export default PaperList;