/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlbumConfig } from "../../types";
import { calculateAlbumStats } from "../../data";
import { useLanguage } from "../../context/LanguageContext";

// Organisms
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import ConfigForm from "../organisms/ConfigForm";
import KpiCards from "../organisms/KpiCards";
import StrategyAdvice from "../organisms/StrategyAdvice";
import MonteCarloSimulator from "../organisms/MonteCarloSimulator";
import MethodologyModal from "../organisms/MethodologyModal";
import PrivacyModal from "../organisms/PrivacyModal";

// Templates
import DashboardTemplate from "../templates/DashboardTemplate";

// Atoms
import Badge from "../atoms/Badge";

export default function DashboardPage() {
  const { t } = useLanguage();

  // --- Estado de la Colección ---
  const [config, setConfig] = useState<AlbumConfig>({
    country: "Argentina",
    currency: "ARS",
    albumPrice: 5000,
    packPrice: 1000,
    totalStickers: 638,
    stickersPerPack: 5,
    useSwaps: false,
    groupSize: 5,
  });

  // --- Estados de Modales ---
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // --- Cálculo Matemático Reactivo ---
  const calculationResult = calculateAlbumStats(config);

  // Construct Slots for DashboardTemplate
  const headerSlot = (
    <Header onOpenMethodology={() => setIsMethodologyOpen(true)} />
  );

  const heroBannerSlot = (
    <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
      <Badge>
        <span>📊</span>
        <span>{t("hero.modelLabel")}</span>
      </Badge>
      
      <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight text-brand-dark uppercase italic leading-none">
        {t("hero.title")}
      </h2>
      
      <p className="font-sans text-sm md:text-base text-gray-600 max-w-lg mx-auto">
        {t("hero.description")}
      </p>
    </div>
  );

  const sidebarSlot = (
    <ConfigForm config={config} onChange={(newConfig) => setConfig(newConfig)} />
  );

  const kpiCardsSlot = (
    <KpiCards result={calculationResult} config={config} />
  );

  const strategyAdviceSlot = (
    <StrategyAdvice result={calculationResult} config={config} />
  );

  const simulatorSlot = (
    <MonteCarloSimulator config={config} />
  );

  const footerSlot = (
    <Footer 
      onOpenMethodology={() => setIsMethodologyOpen(true)} 
      onOpenPrivacy={() => setIsPrivacyOpen(true)} 
    />
  );

  const modalsSlot = (
    <>
      <MethodologyModal 
        isOpen={isMethodologyOpen} 
        onClose={() => setIsMethodologyOpen(false)} 
      />
      <PrivacyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />
    </>
  );

  return (
    <DashboardTemplate
      header={headerSlot}
      heroBanner={heroBannerSlot}
      sidebar={sidebarSlot}
      kpiCards={kpiCardsSlot}
      strategyAdvice={strategyAdviceSlot}
      simulator={simulatorSlot}
      footer={footerSlot}
      modals={modalsSlot}
    />
  );
}
