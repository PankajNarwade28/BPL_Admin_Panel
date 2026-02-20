import React from 'react';

const LoadingAnimation = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
      <div className="relative">
        {/* Main Loading Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slideUp">
          {/* Cricket Animation - GIF Loop */}
          <div className="relative">
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
              <img
                src="/assets/Untitled file.gif"
                alt="Cricket Animation"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Pulsing Ring Around Animation */}
            <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 animate-pulse"></div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {message}
            </h3>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Progress Message */}
            <p className="text-gray-600 text-sm font-medium mt-4">
              Please wait while we process your request
            </p>
          </div>

          {/* Cricket Bat Icon (Decorative) */}
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 animate-pulse">
            🏏
          </div>
        </div>

        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
