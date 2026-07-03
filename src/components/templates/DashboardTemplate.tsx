/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface DashboardTemplateProps {
  header: React.ReactNode;
  heroBanner: React.ReactNode;
  sidebar: React.ReactNode;
  kpiCards: React.ReactNode;
  strategyAdvice: React.ReactNode;
  simulator: React.ReactNode;
  footer: React.ReactNode;
  modals?: React.ReactNode;
}

export default function DashboardTemplate({
  header,
  heroBanner,
  sidebar,
  kpiCards,
  strategyAdvice,
  simulator,
  footer,
  modals,
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-brand-dark flex flex-col font-sans selection:bg-brand-red selection:text-white">
      {/* Header Slot */}
      {header}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
        
        {/* Intro Hero Banner Slot */}
        {heroBanner}

        {/* Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Lado Izquierdo: Configuración (Formulario) */}
          <div className="lg:col-span-5 flex justify-center">
            {sidebar}
          </div>

          {/* Lado Derecho: Dashboard de Resultados & Simulador */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KPI Cards Slot */}
            {kpiCards}

            {/* Strategy Advice Slot */}
            {strategyAdvice}

            {/* Monte Carlo Simulator Slot */}
            {simulator}

          </div>

        </div>

      </main>

      {/* Footer Slot */}
      {footer}

      {/* Modals Container Slot */}
      {modals}
    </div>
  );
}
