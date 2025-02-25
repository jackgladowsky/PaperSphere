import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare, Share, ExternalLink } from "lucide-react";

const PaperCard = ({ paper }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-200 hover:translate-y-px">
      <div className="p-6">
        <Link to={`/paper/${paper.id}`} className="block">
          <h2 className="text-xl font-bold text-gray-800 leading-tight mb-1 hover:text-blue-600 transition-colors">
            {paper.title}
          </h2>
        </Link>
       
        <p className="text-sm text-gray-500 mb-4 flex flex-wrap items-center">
          By <span className="font-medium ml-1">{paper.authors}</span>
        </p>
       
        <p className="text-gray-700 leading-relaxed">
          {paper.summary || paper.abstract}
        </p>
       
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
              <ThumbsUp size={18} className="mr-1" />
            </button>
           
            <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors">
              <ThumbsDown size={18} className="mr-1" />
            </button>
           
            <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
              <MessageSquare size={18} className="mr-1" />
            </button>
           
            <button className="flex items-center text-gray-500 hover:text-purple-600 transition-colors">
              <Share size={18} className="mr-1" />
            </button>
          </div>
         
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <span className="mr-1 text-sm">Read Paper</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;