"use client";

import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-[#511b7d] hover:text-white",
    secondary: "bg-secondary text-white hover:bg-[#7a43b8] hover:text-white",
    outline: "bg-transparent border border-primary text-primary hover:bg-[#f8f0ff] hover:text-primary",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${
        variantClasses[variant]
      } ${
        fullWidth ? "w-full" : ""
      } py-2.5 px-4 rounded-md transition-all duration-200 font-medium flex items-center justify-center shadow-sm ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button; 