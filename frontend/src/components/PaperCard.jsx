import React from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Share, ExternalLink } from "lucide-react";

const PaperCard = ({ paper }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{paper.title}</h2>
      <p className="text-sm text-gray-600">By {paper.authors}</p>
      <p className="mt-2 text-gray-800">{paper.summary || paper.abstract}</p>
      
      {/* Icons Row */}
      <div className="flex items-center gap-4 mt-4 text-gray-600">
        <button className="flex items-center hover:text-blue-500">
          <ThumbsUp size={20} className="mr-1" />
        </button>
        <button className="flex items-center hover:text-red-500">
          <ThumbsDown size={20} className="mr-1" />
        </button>
        <button className="flex items-center hover:text-green-500">
          <MessageSquare size={20} className="mr-1" />
        </button>
        <button className="flex items-center hover:text-purple-500">
          <Share size={20} className="mr-1" />
        </button>
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ExternalLink size={20} className="mr-1" />
        </a>
      </div>
    </div>
  );
};

export default PaperCard;
