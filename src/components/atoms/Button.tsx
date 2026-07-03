/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "footer";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none";
  
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-brand-blue rounded-xl",
    secondary: "bg-brand-blue text-white hover:bg-blue-600 rounded-xl neo-border neo-shadow-sm hover:-translate-y-0.5 active:translate-y-0",
    danger: "bg-brand-red text-white hover:bg-red-600 rounded-xl neo-border neo-shadow-sm hover:-translate-y-0.5 active:translate-y-0",
    outline: "bg-white hover:bg-brand-cream border-2 border-brand-dark rounded-xl neo-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "bg-white hover:bg-brand-cream border-2 border-brand-dark rounded-full font-mono text-xs text-brand-dark hover:text-brand-red neo-shadow-sm",
    footer: "bg-gray-800 hover:bg-brand-red border border-gray-700 hover:border-brand-dark rounded-full text-gray-200 text-[10px]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-5 py-3 text-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
