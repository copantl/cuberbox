
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="relative group/logo">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full group-hover/logo:scale-105 transition-transform duration-700 ease-out"
        >
          {/* Outer Hexagon - Thin Stroke */}
          <path
            d="M50 5L90 28V72L50 95L10 72V28L50 5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="text-blue-500/30"
          />
          
          {/* Inner Cube Structure - Elegant Lines */}
          <path
            d="M50 50L90 28M50 50L10 28M50 50V95"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-blue-500/50"
          />

          {/* Core Cube - Solid with subtle gradient */}
          <path
            d="M50 50L75 36V64L50 78V50Z"
            fill="url(#coreGradientRight)"
          />
          <path
            d="M50 50L25 36V64L50 78V50Z"
            fill="url(#coreGradientLeft)"
          />
          <path
            d="M50 22L25 36L50 50L75 36L50 22Z"
            fill="white"
            fillOpacity="0.9"
          />

          {/* Glow points */}
          <circle cx="50" cy="50" r="1" fill="white" className="animate-pulse" />
          
          <defs>
            <linearGradient id="coreGradientLeft" x1="50" y1="50" x2="25" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="coreGradientRight" x1="50" y1="50" x2="75" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl -z-10 group-hover/logo:bg-blue-500/20 transition-colors duration-700"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">CUBERBOX</span>
          <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">CUBERBOX Nexus Core</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
