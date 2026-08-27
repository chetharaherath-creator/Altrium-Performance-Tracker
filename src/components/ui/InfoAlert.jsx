import React from 'react';

export default function InfoAlert({ title, children, variant = 'green' }) {
  const bgColors = {
    green: 'bg-[#F0F8F1]',
    yellow: 'bg-[#FFF9E6]',
  };

  return (
    <div className={`${bgColors[variant]} rounded-lg p-6 mb-6 shadow-sm border border-gray-100`}>
      {title && <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>}
      <div className="text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
