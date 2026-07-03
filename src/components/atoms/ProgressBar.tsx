/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
  barColor?: string;
}

export default function ProgressBar({
  progress,
  className = "",
  barColor = "bg-brand-red"
}: ProgressBarProps) {
  const cappedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`w-full h-4 bg-white border-2 border-brand-dark rounded-full overflow-hidden p-[2px] ${className}`}>
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${cappedProgress}%` }}
      />
    </div>
  );
}
