/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../atoms/Button";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl border-4 border-brand-dark neo-shadow p-6 space-y-4 animate-scale-in">
        <div className="flex items-center gap-2.5 text-brand-blue font-display font-bold text-lg border-b-2 border-gray-100 pb-2">
          <ShieldAlert size={22} className="text-brand-blue" />
          <h3>{t("privacy.title")}</h3>
        </div>

        <p className="font-sans text-xs text-gray-700 leading-relaxed">
          {t("privacy.intro")}
        </p>

        <ul className="space-y-2 font-mono text-[11px] text-gray-600 bg-brand-cream border-2 border-brand-dark p-3.5 rounded-xl">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span><strong>{t("privacy.pt1Title")}</strong> {t("privacy.pt1Desc")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span><strong>{t("privacy.pt2Title")}</strong> {t("privacy.pt2Desc")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span><strong>{t("privacy.pt3Title")}</strong> {t("privacy.pt3Desc")}</span>
          </li>
        </ul>

        <p className="font-sans text-xs text-gray-500 italic">
          {t("privacy.disclaimer")}
        </p>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            id="btn-close-privacy"
            variant="primary"
            size="sm"
          >
            {t("privacy.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
