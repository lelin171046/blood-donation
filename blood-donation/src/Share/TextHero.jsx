import React from 'react';

const TextHero = ({ quote, author }) => {
    return (
        <div>
            <div className="text-center px-4 py-8 max-w-2xl mx-auto">
      {/* Quote Icon */}
      <div className="text-4xl text-red-600 mb-4">
        <span className="inline-block">❝</span>
      </div>

      {/* Quote Text */}
      <p className="text-2xl italic font-medium text-black">
        "{quote}"
      </p>

      {/* Author */}
      <p className="mt-4 text-red-600 font-semibold">{author}</p>
    </div>
        </div>
    );
};

export default TextHero;