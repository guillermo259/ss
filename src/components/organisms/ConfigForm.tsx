/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlbumConfig } from "../../types";
import { COUNTRIES_OPTIONS, CURRENCIES_OPTIONS } from "../../data";
import { Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import FormField from "../molecules/FormField";

interface ConfigFormProps {
  config: AlbumConfig;
  onChange: (config: AlbumConfig) => void;
}

export default function ConfigForm({ config, onChange }: ConfigFormProps) {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = React.useState(0);

  // Estado local de texto para inputs numéricos, para permitir borrar sin forzar 0
  const [rawValues, setRawValues] = React.useState<Record<string, string>>({});

  // Manejador genérico de cambios
  const updateField = (key: keyof AlbumConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  // Manejador de inputs numéricos: guarda string en rawValues y parsea al config solo si es válido
  const handleNumericChange = (
    key: keyof AlbumConfig,
    raw: string,
    parser: (v: string) => number,
    fallback: number
  ) => {
    setRawValues((prev) => ({ ...prev, [key]: raw }));
    const parsed = parser(raw);
    if (!isNaN(parsed) && raw.trim() !== "") {
      updateField(key, parsed);
    }
  };

  // Al perder el foco, si el campo está vacío aplica el fallback
  const handleNumericBlur = (
    key: keyof AlbumConfig,
    fallback: number
  ) => {
    setRawValues((prev) => {
      const raw = prev[key];
      if (raw === undefined || raw.trim() === "" || isNaN(Number(raw))) {
        updateField(key, fallback);
        return { ...prev, [key]: String(fallback) };
      }
      return prev;
    });
  };

  // Devuelve el valor a mostrar: rawValues si existe, sino el valor del config
  const displayValue = (key: keyof AlbumConfig) =>
    rawValues[key] !== undefined ? rawValues[key] : String(config[key]);

  // Cuando cambia el país, actualizamos también la moneda de forma inteligente por defecto
  const handleCountryChange = (countryName: string) => {
    const selectedCountry = COUNTRIES_OPTIONS.find((c) => c.name === countryName);
    if (selectedCountry) {
      onChange({
        ...config,
        country: countryName,
        currency: selectedCountry.currency,
        albumPrice: selectedCountry.albumPrice,
        packPrice: selectedCountry.packPrice,
      });
    } else {
      updateField("country", countryName);
    }
  };

  const steps = [
    {
      title: language === "es" ? "Ubicación y Moneda" : "Location & Currency",
      desc: language === "es" ? "Paso 1 de 3" : "Step 1 of 3"
    },
    {
      title: language === "es" ? "Precios y Presupuesto" : "Prices & Budget",
      desc: language === "es" ? "Paso 2 de 3" : "Step 2 of 3"
    },
    {
      title: language === "es" ? "Álbum e Intercambios" : "Album & Swaps",
      desc: language === "es" ? "Paso 3 de 3" : "Step 3 of 3"
    }
  ];

  return (
    <div className="bg-white neo-border neo-shadow rounded-3xl p-6 md:p-8 w-full max-w-md space-y-6">
      
      {/* Form title & Step Indicators */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-brand-dark">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🔧</span>
          <div className="flex flex-col">
            <h2 className="font-display font-black text-sm tracking-tight uppercase text-brand-dark italic leading-none">
              {t("config.title")}
            </h2>
            <span className="font-mono text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
              {steps[currentStep].desc}
            </span>
          </div>
        </div>

        {/* Custom Step Numbers Navigation */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
          {[0, 1, 2].map((stepIdx) => (
            <button
              key={stepIdx}
              onClick={() => setCurrentStep(stepIdx)}
              className={`w-6 h-6 rounded-full border-2 border-brand-dark flex items-center justify-center transition-all cursor-pointer ${
                currentStep === stepIdx
                  ? "bg-brand-red text-white scale-110 neo-shadow-sm"
                  : "bg-white text-brand-dark hover:bg-brand-cream"
              }`}
            >
              {stepIdx + 1}
            </button>
          ))}
        </div>
      </div>



      <div className="space-y-5 min-h-[175px] flex flex-col justify-start">
        
        {/* Step 1: Ubicación y Moneda */}
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in w-full">
            {/* Country Select */}
            <FormField label={t("config.country")} icon="🌍">
              <div className="relative">
                <Select
                  value={config.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  id="country-select"
                  className="rounded-full px-5 py-3 text-sm pr-10"
                >
                  {COUNTRIES_OPTIONS.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                  {!COUNTRIES_OPTIONS.some(c => c.name === config.country) && (
                    <option value={config.country}>{config.country}</option>
                  )}
                </Select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none font-mono text-xs text-brand-dark">
                  ▼
                </div>
              </div>
            </FormField>

            {/* Currency Select */}
            <FormField label={t("config.currency")} icon="💰">
              <div className="relative">
                <Select
                  value={config.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  id="currency-select"
                  className="rounded-full px-5 py-3 text-sm pr-10"
                >
                  {CURRENCIES_OPTIONS.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.label}
                    </option>
                  ))}
                  {!CURRENCIES_OPTIONS.some(curr => curr.code === config.currency) && (
                    <option value={config.currency}>{config.currency}</option>
                  )}
                </Select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none font-mono text-xs text-brand-dark">
                  ▼
                </div>
              </div>
            </FormField>
          </div>
        )}

        {/* Step 2: Precios */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in w-full">
            {/* Album Price */}
            <FormField label={t("config.albumPrice")} icon="📕">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  inputMode="decimal"
                  min="0"
                  value={displayValue("albumPrice")}
                  onChange={(e) => handleNumericChange("albumPrice", e.target.value, parseFloat, 0)}
                  onBlur={() => handleNumericBlur("albumPrice", 0)}
                  id="album-price-input"
                  className="rounded-full px-5 py-3 text-sm pr-20"
                />
                <div className="absolute right-5 pointer-events-none font-mono text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  {language === "es" ? "PRECIO" : "PRICE"}
                </div>
              </div>
            </FormField>

            {/* Pack Price */}
            <FormField label={t("config.packPrice")} icon="✉️">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={displayValue("packPrice")}
                  onChange={(e) => handleNumericChange("packPrice", e.target.value, parseFloat, 0.01)}
                  onBlur={() => handleNumericBlur("packPrice", 0.01)}
                  id="pack-price-input"
                  className="rounded-full px-5 py-3 text-sm pr-20 focus:ring-brand-blue"
                />
                <div className="absolute right-5 pointer-events-none font-mono text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  PACK
                </div>
              </div>
            </FormField>
          </div>
        )}

        {/* Step 3: Álbum e Intercambios */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in w-full">
            <div className="grid grid-cols-2 gap-3">
              {/* Total Stickers */}
              <FormField label={t("config.totalStickers")} icon="🔢">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={displayValue("totalStickers")}
                  onChange={(e) => handleNumericChange("totalStickers", e.target.value, (v) => parseInt(v, 10), 0)}
                  onBlur={() => handleNumericBlur("totalStickers", 10)}
                  id="total-stickers-input"
                  className="rounded-xl px-4 py-3 text-xs"
                />
              </FormField>

              {/* Stickers per Pack */}
              <FormField label={t("config.stickersPerPack")} icon="📦">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={displayValue("stickersPerPack")}
                  onChange={(e) => handleNumericChange("stickersPerPack", e.target.value, (v) => parseInt(v, 10), 1)}
                  onBlur={() => handleNumericBlur("stickersPerPack", 1)}
                  id="stickers-per-pack-input"
                  className="rounded-xl px-4 py-3 text-xs focus:ring-brand-blue"
                />
              </FormField>
            </div>

            {/* Divider dot line */}
            <div className="border-t-2 border-dashed border-gray-200 my-2"></div>

            {/* Checkbox Card for Swaps */}
            <div 
              onClick={() => updateField("useSwaps", !config.useSwaps)}
              className={`neo-border neo-shadow-sm rounded-2xl p-4 cursor-pointer transition-all ${
                config.useSwaps ? "bg-amber-100 hover:bg-amber-150" : "bg-brand-cream hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.useSwaps}
                    onChange={() => {}} // Handle on parent div click for better touch target
                    id="use-swaps-checkbox"
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 border-brand-dark flex items-center justify-center transition-all ${
                    config.useSwaps ? "bg-brand-red text-white" : "bg-white text-transparent"
                  }`}>
                    <span className="text-xs font-black">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xs tracking-tight text-brand-dark italic flex items-center gap-1 uppercase leading-none">
                    <span>🤝</span> {t("config.useSwaps")}
                  </h3>
                  <p className="text-[10px] font-mono text-gray-500 mt-1">
                    {t("config.tooltipGroupSize")}
                  </p>
                </div>
              </div>

              {/* Collapsible Group Size Slider */}
              {config.useSwaps && (
                <div 
                  onClick={(e) => e.stopPropagation()} // Prevent closing/toggling swaps on slider interact
                  className="mt-3 pt-3 border-t-2 border-brand-dark/20 space-y-2"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold text-brand-dark">
                    <span className="flex items-center gap-1">
                      <Users size={11} className="text-brand-blue" />
                      {t("config.groupSize")}:
                    </span>
                    <span className="px-2 py-0.5 bg-brand-dark text-white rounded text-[10px] font-mono">
                      {config.groupSize} {t("config.people")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gray-400 font-bold">2</span>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={config.groupSize}
                      onChange={(e) => updateField("groupSize", parseInt(e.target.value))}
                      id="group-size-slider"
                      className="flex-1 h-2.5 bg-brand-cream rounded-full appearance-none border-2 border-brand-dark cursor-pointer accent-brand-red focus:outline-none"
                    />
                    <span className="font-mono text-[10px] text-gray-400 font-bold">20</span>
                  </div>
                  <p className="text-[9px] text-brand-blue font-mono font-medium italic">
                    {language === "es" ? "Reducción" : "Reduction"}: {getSwapReductionPercentage(config.groupSize)}% {language === "es" ? "gracias al intercambio" : "thanks to swapping"}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Wizard navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-brand-dark">
        <button
          type="button"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`px-4 py-2.5 font-mono text-[11px] font-bold rounded-xl border-2 border-brand-dark transition-all ${
            currentStep === 0
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-brand-dark hover:bg-brand-cream hover:-translate-y-0.5 active:translate-y-0 neo-shadow-sm cursor-pointer"
          }`}
        >
          {language === "es" ? "◀ ATRÁS" : "◀ BACK"}
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentStep < 2) {
              setCurrentStep((s) => s + 1);
            }
          }}
          disabled={currentStep === 2}
          className={`px-4 py-2.5 font-mono text-[11px] font-bold rounded-xl border-2 border-brand-dark transition-all ${
            currentStep === 2
              ? "bg-green-100 text-green-700 border-green-500 cursor-default font-black"
              : "bg-brand-dark text-white hover:bg-brand-blue hover:-translate-y-0.5 active:translate-y-0 neo-shadow-sm cursor-pointer"
          }`}
        >
          {currentStep === 2 
            ? (language === "es" ? "✓ SIMULACIÓN LISTA" : "✓ READY") 
            : (language === "es" ? "SIGUIENTE ▶" : "NEXT ▶")}
        </button>
      </div>

    </div>
  );
}

// Helper to display swap reduction
function getSwapReductionPercentage(g: number): number {
  if (g <= 1) return 0;
  if (g === 2) return 30;
  if (g === 3) return 40;
  if (g === 4) return 46;
  if (g === 5) return 50;
  if (g === 6) return 54;
  if (g === 7) return 58;
  if (g === 8) return 61;
  if (g === 9) return 63;
  if (g === 10) return 65;
  if (g < 15) return 65 + (g - 10);
  return Math.min(75, 70 + Math.floor((g - 15) * 0.6));
}
