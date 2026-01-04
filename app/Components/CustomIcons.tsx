"use client";

import React, { useId } from 'react';

export const SolanaLogo = ({ className }: { className?: string }) => {
  const id = useId();
  const grad1 = `solana_1_${id}`;
  const grad2 = `solana_2_${id}`;
  const grad3 = `solana_3_${id}`;

  return (
    <svg
      viewBox="0 0 397 311"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Solana"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={grad1} x1="64.6" y1="237.9" x2="333.1" y2="300.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id={grad2} x1="64.6" y1="3.8" x2="333.1" y2="66.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id={grad3} x1="6.5" y1="120.1" x2="275" y2="182.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${grad1})`}
        d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
      />
      <path
        fill={`url(#${grad2})`}
        d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
      />
      <path
        fill={`url(#${grad3})`}
        d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
      />
    </svg>
  );
};

export const IdealLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="iDEAL"
  >
     {/* Background rounded rect for high contrast and brand recognition */}
     <rect width="100" height="44" rx="8" fill="#CC0066" />
     
     {/* Clean geometric letters for 'iDEAL' in white */}
     <g transform="translate(14, 10)">
        {/* i */}
        <path fill="#fff" d="M0 8h4v16H0z M0 0h4v5H0z" />
        
        {/* D */}
        <path fill="#fff" d="M10 0h6c6 0 10 4 10 12s-4 12-10 12h-6V0zm4 20h2c3.5 0 6-2.5 6-8s-2.5-8-6-8h-2v16z" />
        
        {/* E */}
        <path fill="#fff" d="M32 0h12v4h-8v6h7v4h-7v6h8v4H32V0z" />
        
        {/* A */}
        <path fill="#fff" d="M50 0h5l6 24h-4l-1.2-5h-6.6l-1.2 5h-4L50 0zm2.5 15h4L54.5 6 52.5 15z" />
        
        {/* L */}
        <path fill="#fff" d="M66 0h4v20h8v4H66V0z" />
     </g>
  </svg>
);
