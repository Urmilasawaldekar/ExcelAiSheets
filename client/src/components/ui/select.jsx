import React from 'react';

export const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded p-2"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export const SelectValue = ({ placeholder }) => {
  return <option disabled value="">{placeholder}</option>;
};

export const SelectContent = ({ children }) => {
  return <>{children}</>;
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
