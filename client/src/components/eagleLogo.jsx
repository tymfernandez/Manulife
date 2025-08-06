import React from 'react';

const EagleLogo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`${className} bg-white rounded flex items-center justify-center`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5C13.1 2.9 12.6 3 12 3S10.9 2.9 10.5 2.5L9 1L3 7V9C3 10.1 3.9 11 5 11V12.5C5 14.4 6.6 16 8.5 16S12 14.4 12 12.5V11C13.1 11 14 10.1 14 9V7.5L15.5 9H17C18.7 9 20 10.3 20 12C20 13.7 18.7 15 17 15H15L12 18L9 15H7C5.3 15 4 13.7 4 12C4 10.3 5.3 9 7 9H8.5L10 7.5V9C10 10.1 10.9 11 12 11V12.5C12 14.4 13.6 16 15.5 16S19 14.4 19 12.5V11C20.1 11 21 10.1 21 9Z"/>
      </svg>
    </div>
  );
};

export default EagleLogo;