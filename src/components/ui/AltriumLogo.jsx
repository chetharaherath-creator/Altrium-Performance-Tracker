import React from 'react';

export default function AltriumLogo({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon Background */}
      <path d="M50 4 L92 28.5 V71.5 L50 96 L8 71.5 V28.5 L50 4Z" fill="#FDB913"/>
      {/* Chevron / Lambda */}
      <path d="M28 72 L50 28 L72 72" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
