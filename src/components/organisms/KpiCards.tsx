/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CalculationResult, AlbumConfig } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import KpiCard from "../molecules/KpiCard";

interface KpiCardsProps {
  result: CalculationResult;
  config: AlbumConfig;
}

export default function KpiCards({ result, config }: KpiCardsProps) {
  const { language } = useLanguage();

  // Formateador de moneda personalizado
  const formatMoney = (amount: number) => {
    const isDecimalCurrency = ["EUR", "USD", "EUR (€)", "USD ($)", "€", "$"].includes(config.currency.toUpperCase()) || config.currency === "€" || config.currency === "$";
    return `${config.currency} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: isDecimalCurrency ? 2 : 0,
      maximumFractionDigits: isDecimalCurrency ? 2 : 0,
    })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
      {/* Packs Needed Card */}
      <KpiCard
        title={language === "es" ? "PAQUETES" : "PACKS"}
        value={result.packsNeeded}
        footer={language === "es" ? "PARA COMPLETAR" : "TO COMPLETE"}
        ribbonText={language === "es" ? "Matemáticas" : "Math"}
        ribbonBg="bg-brand-gold"
        bgColorClass="bg-white"
        icon="📦"
      />

      {/* Packs Cost Card */}
      <KpiCard
        title={language === "es" ? "GASTO SOBRES" : "PACKS COST"}
        value={formatMoney(result.packsCost)}
        footer={language === "es" ? "MONEDA LOCAL" : "LOCAL CURRENCY"}
        ribbonText={language === "es" ? "Sobres" : "Packs"}
        ribbonBg="bg-brand-blue"
        ribbonTextClass="text-white"
        bgColorClass="bg-brand-cream"
        icon="💵"
      />

      {/* Total Cost Card */}
      <KpiCard
        title={language === "es" ? "INVERSIÓN FINAL" : "TOTAL COST"}
        value={formatMoney(result.totalCost)}
        footer={language === "es" ? "TODO INCLUIDO" : "ALL INCLUDED"}
        ribbonText={language === "es" ? "Álbum + Pack" : "Album + Pack"}
        ribbonBg="bg-brand-red"
        ribbonTextClass="text-white"
        bgColorClass="bg-red-50"
        icon="🏆"
      />
    </div>
  );
}
