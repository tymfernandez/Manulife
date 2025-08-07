import React from 'react';

const Avatar = ({ name, className = "" }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
  ];
  const colorIndex = name.length % colors.length;
  
  return (
    <div className={`${colors[colorIndex]} text-white rounded-full flex items-center justify-center text-sm font-medium ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;