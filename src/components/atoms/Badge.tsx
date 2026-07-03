/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-brand-gold border-2 border-brand-dark rounded-full font-mono text-xs font-bold neo-shadow-sm rotate-1 ${className}`}>
      {children}
    </div>
  );
}
