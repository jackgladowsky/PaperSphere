import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users, BookOpen, Download, Share, ThumbsUp, ThumbsDown, MessageSquare, Tag, AlertCircle } from "lucide-react";

const PaperDetails = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample fallback data for development
  const fallbackPaper = {
    id: id,
    arxiv_id: id,
    title: "Paper details currently unavailable",
    authors: "Author information will appear here",
    category: "cs.CL",
    abstract: "This paper's abstract will be displayed here once connected to the database.",
    summary: "A summary of the paper's key findings and contributions will be shown here.",
    url: `http://arxiv.org/abs/${id}`,
    published_at: new Date().toISOString()
  };

  useEffect(() => {
    const fetchPaperDetails = async () => {
      setLoading(true);
      try {
        // Attempt to fetch from API
        const response = await fetch(`http://localhost:8000/papers/${id}`);
        
        if (!response.ok) {
          // For development: use fallback data instead of throwing error
          console.warn(`API returned ${response.status}, using fallback data`);
          setPaper(fallbackPaper);
        } else {
          const data = await response.json();
          setPaper(data);
        }
      } catch (err) {
        console.error("Error fetching paper:", err);
        // Use fallback data instead of showing error
        setPaper(fallbackPaper);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return null;
  }

  // Using arxiv_id for display purposes
  const arxivId = paper.arxiv_id || id;
  const formattedDate = paper.published_at 
    ? new Date(paper.published_at).toLocaleDateString() 
    : "Publication date unavailable";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to papers
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {!paper.id && (
          <div className="bg-amber-50 border-b border-amber-100 p-3 flex items-center">
            <AlertCircle size={16} className="text-amber-500 mr-2" />
            <p className="text-amber-700 text-sm">
              This is placeholder data. Connect to the API to see actual paper details.
            </p>
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-4">
            {paper.title || "Untitled Paper"}
          </h1>

          <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>{paper.authors || "Author information unavailable"}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            {paper.category && (
              <div className="flex items-center">
                <Tag size={16} className="mr-2" />
                <span>{paper.category}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Abstract</h2>
            <p className="text-gray-700 leading-relaxed">
              {paper.abstract || "Abstract unavailable at this time."}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">AI Summary</h2>
            <p className="text-gray-700 leading-relaxed">
              {paper.summary || "Summary unavailable. This section will display a concise overview of the paper's key findings and contributions."}
            </p>
          </div>

          {/* Placeholder for citation information
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Citation Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-mono text-sm">
                {paper.authors || "Authors"} ({paper.published_at ? new Date(paper.published_at).getFullYear() : "Year"}). 
                {paper.title || "Title"}. arXiv preprint arXiv:{arxivId}.
              </p>
            </div>
          </div> */}

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-6">
            <a
              href={paper.url || `http://arxiv.org/abs/${arxivId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2" /> Download PDF
            </a>

            <div className="flex items-center gap-4">
              <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                <ThumbsUp size={18} className="mr-1" />
                <span>0</span>
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
                <ThumbsDown size={18} className="mr-1" />
                <span>0</span>
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
                <MessageSquare size={18} className="mr-1" />
                <span>0</span>
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors">
                <Share size={18} className="mr-1" />
                Share
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <strong>arXiv ID:</strong> {arxivId}
            </p>
          </div>
        </div>
      </article>

      {/* Placeholder for comments section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments (0)</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts on this paper.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Add a comment
          </button>
        </div>
      </section>
    </div>
  );
};

export default PaperDetails;