/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HelpCircle, Shield } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../atoms/Button";

interface FooterProps {
  onOpenMethodology: () => void;
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenMethodology, onOpenPrivacy }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-brand-dark border-t-4 border-black text-white px-6 py-8 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-6">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-full bg-brand-red border-3 border-brand-dark flex items-center justify-center font-display font-black text-xs text-white neo-shadow-sm">
            SS
          </div>
          <h1 className="font-display font-black text-xl tracking-tighter text-white italic flex items-center">
            <span>STICKER</span>
            <span className="text-brand-red">STATS</span>
          </h1>
        </div>

        {/* Short info */}
        <p className="text-center font-sans text-xs text-gray-400 max-w-md leading-relaxed">
          {t("footer.desc")}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={onOpenMethodology}
            id="btn-methodology-footer"
            variant="footer"
            size="sm"
          >
            <HelpCircle size={12} className="text-brand-gold" />
            <span>{t("methodology.title").toUpperCase()}</span>
          </Button>

          <Button
            onClick={onOpenPrivacy}
            id="btn-privacy-footer"
            variant="footer"
            size="sm"
          >
            <Shield size={12} className="text-green-400" />
            <span>{t("privacy.title").toUpperCase()}</span>
          </Button>
        </div>

      </div>
    </footer>
  );
}
