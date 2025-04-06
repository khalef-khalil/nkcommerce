"use client";

import { useState, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = ({ label, error, ...props }: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative">
        <motion.label
          htmlFor={props.id}
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isFocused || props.value
              ? "-top-2.5 text-xs bg-white px-1 text-primary"
              : "top-2.5 text-gray-500"
          }`}
          initial={false}
          animate={
            isFocused || props.value
              ? { y: 0, scale: 0.75, x: 0 }
              : { y: 0, scale: 1, x: 0 }
          }
        >
          {label}
        </motion.label>
        <input
          {...props}
          className={`w-full p-2.5 rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormInput; 