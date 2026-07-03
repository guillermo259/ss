/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CalculationResult, AlbumConfig } from "../../types";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface StrategyAdviceProps {
  result: CalculationResult;
  config: AlbumConfig;
}

export default function StrategyAdvice({ result, config }: StrategyAdviceProps) {
  const { t, language } = useLanguage();
  
  const formatMoney = (amount: number) => {
    const isDecimalCurrency = ["EUR", "USD", "€", "$"].includes(config.currency.toUpperCase());
    return `${config.currency} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: isDecimalCurrency ? 2 : 0,
      maximumFractionDigits: isDecimalCurrency ? 2 : 0,
    })}`;
  };

  // Estimate what the solitary cost would have been if they are currently swapping, or what cooperative would be
  const solitaryCostValue = Math.round(result.totalCost / (1 - (result.savingsPercent || 50)/100));
  const coopEstimatedCostValue = Math.round(result.totalCost * 0.50);

  return (
    <div className="bg-brand-gold neo-border neo-shadow rounded-2xl p-5 md:p-6 w-full relative overflow-hidden">
      {/* Dynamic graphic pattern on background */}
      <div className="absolute right-0 bottom-0 opacity-10 select-none pointer-events-none transform translate-x-12 translate-y-12 scale-150">
        <Lightbulb size={120} className="text-brand-dark" />
      </div>

      <div className="flex gap-4 relative z-10">
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-brand-dark text-white items-center justify-center font-black text-xl neo-shadow-sm shrink-0">
          💡
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <span className="font-mono text-[10px] font-bold text-brand-dark/60 uppercase tracking-widest block">
              {language === "es" ? "RECOMENDACIÓN DEL MODELO" : "MODEL RECOMMENDATION"}
            </span>
            <h3 className="font-display font-black text-lg text-brand-dark italic">
              {t("strategy.title")}
            </h3>
          </div>

          {!config.useSwaps ? (
            // SOLITARY COLLECTOR WARNING
            <div className="space-y-2 text-brand-dark font-sans text-sm leading-relaxed">
              <p>
                ⚠️ <strong>{t("strategy.highCost")}</strong> {language === "es" ? "¡Estás coleccionando en solitario! Las matemáticas demuestran que esto es sumamente ineficiente." : "You are collecting alone! Mathematics prove that this is highly inefficient."}
              </p>
              <p>
                {t("strategy.swapOffIntro", { estimatedCoopCost: formatMoney(coopEstimatedCostValue) })}
              </p>
              <div className="bg-white/80 border-2 border-brand-dark rounded-xl p-3 text-xs font-mono space-y-1 neo-shadow-sm mt-2">
                <div className="font-bold text-brand-red">💡 {language === "es" ? "DATO MATEMÁTICO DE ENERGÍA" : "MATH ENERGY FACT"}:</div>
                <p>
                  {language === "es"
                    ? "Conseguir las últimas 10 figuritas de tu álbum requerirá abrir aproximadamente el 25% de todos tus paquetes. ¡Ese último tramo cuesta lo mismo que completar la primera mitad del álbum completo!"
                    : "Getting the last 10 stickers of your album will require opening approximately 25% of all your packs. That final stretch costs the same as completing the first half of the entire album!"}
                </p>
              </div>
            </div>
          ) : (
            // COLLABORATIVE SWAPPING ADVANTAGE
            <div className="space-y-2 text-brand-dark font-sans text-sm leading-relaxed">
              <p>
                🎉 <strong>{t("strategy.activeCoop")}</strong> {language === "es" ? "¡Excelente decisión colaborativa!" : "Excellent collaborative choice!"}
              </p>
              <p>
                {t("strategy.swapOnIntro", { 
                  groupSize: config.groupSize, 
                  solitaryCost: formatMoney(solitaryCostValue), 
                  averageCost: formatMoney(result.totalCost), 
                  percentage: result.savingsPercent.toFixed(0) 
                })}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-white/85 border-2 border-brand-dark rounded-xl p-3 flex items-center gap-2.5 neo-shadow-sm">
                  <span className="text-xl">📦</span>
                  <div className="font-mono text-xs">
                    <div className="text-gray-500 font-bold uppercase text-[9px]">{language === "es" ? "Ahorro en Sobres" : "Packs Saved"}</div>
                    <div className="font-bold text-brand-red text-sm">-{result.savingsPacks} {language === "es" ? "paquetes" : "packs"}</div>
                  </div>
                </div>

                <div className="bg-white/85 border-2 border-brand-dark rounded-xl p-3 flex items-center gap-2.5 neo-shadow-sm">
                  <span className="text-xl">💰</span>
                  <div className="font-mono text-xs">
                    <div className="text-gray-500 font-bold uppercase text-[9px]">{language === "es" ? "Ahorro en Dinero" : "Money Saved"}</div>
                    <div className="font-bold text-brand-blue text-sm">{formatMoney(result.savingsCost)}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-brand-dark/80 italic mt-2">
                {language === "es" 
                  ? "*Nota: Esta reducción estadística asume un intercambio de repetidas perfecto e ideal dentro de tu grupo de amigos, maximizando el valor de cada figurita excedente."
                  : "*Note: This statistical reduction assumes perfect and ideal swap coordinating within your group of friends, maximizing the value of each duplicate."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
