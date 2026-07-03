/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  className?: string;
  children: React.ReactNode;
}

export default function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full bg-white neo-border rounded-xl px-4 py-2.5 font-mono text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
