import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "px-6 py-3 font-display font-bold uppercase tracking-wider transition-all duration-300 clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blood-600 hover:bg-blood-500 text-white shadow-[0_0_15px_rgba(214,0,0,0.5)] border-l-4 border-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-300 border-l-4 border-gray-500",
    danger: "bg-red-900 hover:bg-red-800 text-red-100 border-l-4 border-red-500"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};