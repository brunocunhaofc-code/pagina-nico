
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  const inputId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        id={inputId}
        className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};
   