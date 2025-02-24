import React from "react";

const PaperCard = ({ paper }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{paper.title}</h2>
      <p className="text-sm text-gray-600">By {paper.authors}</p>
      <p className="mt-2 text-gray-800">{paper.summary || paper.abstract}</p>
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        Read more
      </a>
    </div>
  );
};

export default PaperCard;
