/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  className?: string;
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-white neo-border rounded-xl px-4 py-2.5 font-mono text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-red ${className}`}
      {...props}
    />
  );
}
