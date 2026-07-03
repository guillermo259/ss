/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-brand-cream border-3 border-brand-dark rounded-full p-[2px] neo-shadow-sm font-mono text-[11px] font-bold">
      <button
        onClick={() => setLanguage("es")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
          language === "es"
            ? "bg-brand-red text-white"
            : "text-brand-dark hover:text-brand-red"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
          language === "en"
            ? "bg-brand-red text-white"
            : "text-brand-dark hover:text-brand-red"
        }`}
      >
        EN
      </button>
    </div>
  );
}
