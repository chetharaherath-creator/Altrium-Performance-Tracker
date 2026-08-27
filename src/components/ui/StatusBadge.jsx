import React from 'react';

export default function StatusBadge({ status }) {
  // Determine color based on status text
  let colorClass = 'bg-gray-300';
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('submitted') || lowerStatus.includes('complete')) {
    colorClass = 'bg-green-500';
  } else if (lowerStatus.includes('pending') || lowerStatus.includes('progress')) {
    colorClass = 'bg-amber-500';
  } else if (lowerStatus.includes('not')) {
    colorClass = 'bg-gray-400';
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
      <span className="text-sm text-gray-700 font-medium">{status}</span>
    </div>
  );
}
