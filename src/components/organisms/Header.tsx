/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../atoms/Button";
import LanguageSwitcher from "../molecules/LanguageSwitcher";

interface HeaderProps {
  onOpenMethodology: () => void;
}

export default function Header({ onOpenMethodology }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white border-b-4 border-brand-dark px-4 py-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
      {/* Logo Area */}
      <div className="flex items-center gap-2.5 select-none">
        <div className="w-10 h-10 rounded-full bg-brand-red border-3 border-brand-dark flex items-center justify-center font-display font-black text-sm text-white neo-shadow-sm select-none">
          SS
        </div>
        <div className="flex flex-col">
          <h1 className="font-display font-black text-2xl tracking-tighter text-brand-dark italic flex items-center">
            <span>STICKER</span>
            <span className="text-brand-red">STATS</span>
          </h1>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        <Button
          onClick={onOpenMethodology}
          id="btn-methodology-header"
          variant="ghost"
          size="sm"
        >
          <HelpCircle size={14} className="text-brand-blue" />
          <span>{t("header.methodology")}</span>
        </Button>
      </div>
    </header>
  );
}
