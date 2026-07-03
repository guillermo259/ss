/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface FormFieldProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
}

export default function FormField({ label, icon, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="font-mono text-xs font-bold text-brand-dark uppercase tracking-wide flex items-center gap-1.5">
        {icon && <span className="text-base">{icon}</span>}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}
