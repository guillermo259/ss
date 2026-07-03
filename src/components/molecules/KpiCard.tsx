/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  footer: string;
  ribbonText: string;
  ribbonBg: string;
  ribbonTextClass?: string;
  bgColorClass?: string;
  icon?: string;
}

export default function KpiCard({
  title,
  value,
  footer,
  ribbonText,
  ribbonBg,
  ribbonTextClass = "text-brand-dark",
  bgColorClass = "bg-white",
  icon
}: KpiCardProps) {
  return (
    <div className={`${bgColorClass} neo-border neo-shadow rounded-2xl p-5 text-center relative overflow-hidden flex flex-col justify-between min-h-[170px] transform hover:-translate-y-1 transition-all duration-200`}>
      {/* Ribbon decoration */}
      <div className={`absolute top-0 right-0 ${ribbonBg} border-b-2 border-l-2 border-brand-dark px-3 py-0.5 text-[9px] font-mono font-bold tracking-wider ${ribbonTextClass} rounded-bl-lg uppercase`}>
        {ribbonText}
      </div>
      
      <div>
        <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
          <span>{title}</span>
          {icon && <span>{icon}</span>}
        </span>
        <div className="my-3">
          <span className="font-display font-black text-4xl tracking-tight text-brand-dark">
            {value}
          </span>
        </div>
      </div>
      
      <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mt-auto border-t border-dashed border-gray-200 pt-2">
        {footer}
      </div>
    </div>
  );
}
