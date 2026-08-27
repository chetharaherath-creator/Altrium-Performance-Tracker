import React from 'react';

export default function Card({ title, subtitle, rightElement, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {(title || rightElement) && (
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {rightElement && <div>{rightElement}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
