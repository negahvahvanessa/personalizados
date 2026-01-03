import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  themeColor?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  themeColor = 'pink',
  ...props 
}) => {
  const baseStyles = "rounded-full transition-all duration-200 font-semibold flex items-center justify-center gap-2";
  
  // Dynamic styles based on themeColor
  const variants = {
    primary: `bg-${themeColor}-400 hover:bg-${themeColor}-500 text-white shadow-md hover:shadow-lg`,
    secondary: `bg-white text-${themeColor}-500 border-2 border-${themeColor}-200 hover:border-${themeColor}-300 hover:bg-${themeColor}-50`,
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};