
// // src/components/Loading.jsx
// import React from 'react';
// import './Loading.css';

// const Loading = () => {
//   return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Loading...</p>
//     </div>
//   );
// };

// export default Loading;





// src/components/Loading.jsx
import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizes = {
    small: { spinner: 'w-6 h-6', text: 'text-sm' },
    medium: { spinner: 'w-10 h-10', text: 'text-base' },
    large: { spinner: 'w-16 h-16', text: 'text-lg' }
  };

  const { spinner, text } = sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative">
        {/* Spinner */}
        <div className={`${spinner} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
        
        {/* Optional inner spinner */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1/2 h-1/2 border-2 border-transparent border-t-blue-300 rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className={`mt-4 ${text} text-gray-600 flex items-center gap-2`}>
        <span className="animate-pulse">{message}</span>
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
        </span>
      </div>
      
      {/* Optional progress bar for longer loads */}
      <div className="mt-6 w-48 bg-gray-200 rounded-full h-1.5">
        <div className="bg-blue-500 h-1.5 rounded-full animate-progress w-0"></div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export const PageLoading = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <Loading size="large" message="Loading application..." />
  </div>
);

export const InlineLoading = ({ message = 'Loading...' }) => (
  <div className="inline-flex items-center gap-2">
    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    <span className="text-sm text-gray-600">{message}</span>
  </div>
);

export const SkeletonLoader = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

export default Loading;