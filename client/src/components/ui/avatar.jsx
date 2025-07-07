import React from 'react';

export const Avatar = ({ children, className }) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const AvatarFallback = ({ children, className }) => {
  return (
    <span className={`text-white font-bold ${className}`}>
      {children}
    </span>
  );
};
