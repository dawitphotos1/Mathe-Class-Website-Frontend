// src/components/Loading.jsx - FIXED VERSION
import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizes = {
    small: { spinner: 'w-6 h-6 border-2', text: 'text-sm' },
    medium: { spinner: 'w-10 h-10 border-3', text: 'text-base' },
    large: { spinner: 'w-16 h-16 border-4', text: 'text-lg' }
  };

  const { spinner, text } = sizes[size] || sizes.medium;

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <div className="relative">
        {/* Outer spinner */}
        <div 
          className={`${spinner} border-gray-200 border-t-blue-500 rounded-full animate-spin`}
          role="status"
          aria-label="loading"
        />
        
        {/* Optional inner spinner for visual effect */}
        {size === 'large' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-2 border-transparent border-t-blue-300 rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Loading text */}
      {message && (
        <div className={`mt-4 ${text} text-gray-600 flex items-center gap-2`}>
          <span className="animate-pulse">{message}</span>
          <span className="flex">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          </span>
        </div>
      )}
    </div>
  );
};

export const PageLoading = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
    <Loading size="large" message="Loading application..." />
  </div>
);

export const InlineLoading = ({ message = 'Loading...' }) => (
  <div className="inline-flex items-center gap-2">
    <div 
      className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
      role="status"
      aria-label="loading"
    />
    <span className="text-sm text-gray-600">{message}</span>
  </div>
);

export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    ))}
  </div>
);

export default Loading;