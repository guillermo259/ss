/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { AlbumConfig, MonteCarloStats } from "../../types";
import { calculateHarmonicNumber, getSwapReductionFactor } from "../../data";
import { Play, Pause, RotateCcw, Zap, BarChart2, CheckCircle2, Award, Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../atoms/Button";
import ProgressBar from "../atoms/ProgressBar";

interface MonteCarloSimulatorProps {
  config: AlbumConfig;
}

export default function MonteCarloSimulator({ config }: MonteCarloSimulatorProps) {
  const { t, language } = useLanguage();

  // --- Estados de Simulación Paso a Paso ---
  const [album, setAlbum] = useState<number[]>([]);
  const [packsOpened, setPacksOpened] = useState(0);
  const [stickersCollected, setStickersCollected] = useState(0);
  const [duplicates, setDuplicates] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(120); // ms por sobre
  
  // Vista paginada para la grilla
  const [gridPage, setGridPage] = useState(0);
  const stickersPerPage = 60;

  // --- Estados de Simulación por Lotes (Monte Carlo) ---
  const [runsTarget, setRunsTarget] = useState(2000);
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);
  const [batchStats, setBatchStats] = useState<MonteCarloStats>({
    runs: 0,
    averagePacks: 0,
    minPacks: 0,
    maxPacks: 0,
    averageCost: 0,
    savingsCost: 0,
  });
  
  // Histograma de distribución de sobres requeridos
  const [histogramData, setHistogramData] = useState<{ range: string; count: number }[]>([]);

  // Ref para detener simulación asíncrona por lotes
  const stopBatchRef = useRef(false);

  // --- Efecto para simulación continua paso a paso (Auto-llenar) ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        openSinglePack();
      }, simulationSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, album, packsOpened, stickersCollected, duplicates, simulationSpeed, config]);

  // Al cambiar la configuración del álbum, reiniciamos la simulación individual
  useEffect(() => {
    resetSimulation();
  }, [config]);

  // Inicializa el álbum vacío
  const resetSimulation = () => {
    setIsPlaying(false);
    setAlbum(new Array(config.totalStickers).fill(0));
    setPacksOpened(0);
    setStickersCollected(0);
    setDuplicates(0);
    setGridPage(0);
  };

  // Simulación: Abre un solo sobre
  const openSinglePack = () => {
    if (stickersCollected >= config.totalStickers) {
      setIsPlaying(false);
      return;
    }

    const newAlbum = [...album];
    let newCollected = stickersCollected;
    let newDuplicates = duplicates;

    // Generamos figuritas para el sobre de forma aleatoria sin repetidas en el mismo paquete
    const pack: number[] = [];
    while (pack.length < config.stickersPerPack) {
      const stickerId = Math.floor(Math.random() * config.totalStickers);
      if (!pack.includes(stickerId)) {
        pack.push(stickerId);
      }
    }

    // Procesamos cada figurita del sobre
    pack.forEach((stickerId) => {
      if (newAlbum[stickerId] === 0) {
        newAlbum[stickerId] = 1;
        newCollected += 1;
      } else {
        newAlbum[stickerId] += 1;
        newDuplicates += 1;
      }
    });

    setAlbum(newAlbum);
    setPacksOpened((prev) => prev + 1);
    setStickersCollected(newCollected);
    setDuplicates(newDuplicates);

    // Auto-pausar si completamos
    if (newCollected >= config.totalStickers) {
      setIsPlaying(false);
    }
  };

  // --- Simulación Monte Carlo de Alto Rendimiento por Lotes ---
  const runMonteCarloBatch = async () => {
    setIsSimulatingBatch(true);
    stopBatchRef.current = false;

    const totalRuns = runsTarget;
    const batchSize = Math.max(10, Math.floor(totalRuns / 50)); // actualizaciones progresivas de UI
    const results: number[] = [];

    // Reducción por intercambio
    const swapFactor = config.useSwaps ? getSwapReductionFactor(config.groupSize) : 1.0;

    let currentRun = 0;

    // Ejecución asíncrona fragmentada para no congelar la UI
    while (currentRun < totalRuns && !stopBatchRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 0));

      const subBatchSize = Math.min(batchSize, totalRuns - currentRun);
      for (let i = 0; i < subBatchSize; i++) {
        // Simula un llenado completo e individual
        const needed = simulateSingleFullAlbum(config.totalStickers, config.stickersPerPack, swapFactor);
        results.push(needed);
      }

      currentRun += subBatchSize;

      // Calcular métricas parciales para feedback en tiempo real
      if (results.length > 0) {
        const sum = results.reduce((a, b) => a + b, 0);
        const avgPacks = Math.round(sum / results.length);
        const minP = Math.min(...results);
        const maxP = Math.max(...results);
        const avgCost = Math.round(avgPacks * config.packPrice + config.albumPrice);

        // Ahorro teórico comparado con solitario
        let savingsCostVal = 0;
        if (config.useSwaps) {
          const solitaryAvgPacks = Math.round(calculateHarmonicNumber(config.totalStickers) * (config.totalStickers / config.stickersPerPack));
          const solitaryCost = solitaryAvgPacks * config.packPrice + config.albumPrice;
          savingsCostVal = Math.max(0, solitaryCost - avgCost);
        }

        setBatchStats({
          runs: results.length,
          averagePacks: avgPacks,
          minPacks: minP,
          maxPacks: maxP,
          averageCost: avgCost,
          savingsCost: savingsCostVal,
        });

        // Actualizar histograma progresivo
        updateHistogram(results);
      }
    }

    setIsSimulatingBatch(false);
  };

  const stopMonteCarloBatch = () => {
    stopBatchRef.current = true;
  };

  // Simulación de un proceso completo de llenado individual de forma empírica y rápida
  const simulateSingleFullAlbum = (total: number, perPack: number, swapFactor: number): number => {
    const virtualAlbum = new Uint8Array(total);
    let uniqueCollected = 0;
    let packs = 0;

    // Para optimizar velocidad, modelamos la apertura de sobres aleatorios
    while (uniqueCollected < total) {
      packs++;
      // Abrimos un sobre con figuritas aleatorias
      for (let i = 0; i < perPack; i++) {
        const stickerId = Math.floor(Math.random() * total);
        if (virtualAlbum[stickerId] === 0) {
          virtualAlbum[stickerId] = 1;
          uniqueCollected++;
        }
      }
    }

    // Aplicamos el factor de descuento cooperativo de forma empírica y balanceada
    return Math.round(packs * swapFactor);
  };

  // Clasifica los resultados en 5 rangos de distribución (campana)
  const updateHistogram = (data: number[]) => {
    if (data.length === 0) return;
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const rangeSize = (max - min) / 5 || 1;

    const bins = Array.from({ length: 5 }, (_, i) => {
      const start = Math.round(min + i * rangeSize);
      const end = Math.round(min + (i + 1) * rangeSize);
      return {
        range: `${start}-${end}`,
        minVal: start,
        maxVal: end,
        count: 0,
      };
    });

    data.forEach((val) => {
      for (let i = 0; i < bins.length; i++) {
        if (val >= bins[i].minVal && val <= bins[i].maxVal) {
          bins[i].count += 1;
          break;
        }
      }
    });

    setHistogramData(bins.map((b) => ({ range: b.range, count: b.count })));
  };

  // Parámetros para la paginación de la grilla del álbum
  const totalGridPages = Math.ceil(config.totalStickers / stickersPerPage);
  const currentGridStart = gridPage * stickersPerPage;
  const currentGridEnd = Math.min(config.totalStickers, (gridPage + 1) * stickersPerPage);

  const completionPercent = Math.round((stickersCollected / config.totalStickers) * 100) || 0;
  const isCompleted = stickersCollected >= config.totalStickers;

  return (
    <div className="space-y-6">
      
      {/* Playground interactivo */}
      <div className="bg-white border-4 border-brand-dark rounded-3xl p-6 md:p-8 neo-shadow relative overflow-hidden">
        
        {/* Banner de fondo decorativo */}
        <div className="absolute right-0 top-0 bg-brand-blue border-b-4 border-l-4 border-brand-dark text-white px-5 py-1 text-[10px] font-mono font-bold uppercase select-none tracking-widest hidden sm:block">
          INTERACTIVE SIM V4
        </div>

        {/* Header de sección */}
        <div className="flex items-center gap-3.5 pb-4 border-b-4 border-brand-dark mb-5">
          <div className="w-11 h-11 bg-brand-red border-3 border-brand-dark rounded-xl flex items-center justify-center font-black text-xl neo-shadow-sm rotate-2">
            🕹️
          </div>
          <div>
            <h2 className="font-display font-black text-base md:text-lg text-brand-dark uppercase italic tracking-tight leading-none">
              Monte Carlo Engine V4.0
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
              {language === "es" ? "Simulaciones Empíricas en Tiempo Real" : "Real-time Empirical Simulations"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lado Izquierdo: Controles y Progreso */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-4 space-y-4">
              <h3 className="font-mono text-xs font-bold text-brand-dark uppercase tracking-wide flex items-center gap-1">
                <span>🕹️</span> {t("simulator.title")}
              </h3>

              {/* Marcadores */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white border-2 border-brand-dark p-2 rounded-xl">
                  <div className="text-[10px] font-mono text-gray-400 font-bold uppercase">{language === "es" ? "Sobres" : "Packs"}</div>
                  <div className="font-display font-bold text-lg text-brand-dark">{packsOpened}</div>
                </div>
                <div className="bg-white border-2 border-brand-dark p-2 rounded-xl">
                  <div className="text-[10px] font-mono text-gray-400 font-bold uppercase">{language === "es" ? "Unicas" : "Unique"}</div>
                  <div className="font-display font-bold text-sm text-brand-blue truncate">
                    {stickersCollected}/{config.totalStickers}
                  </div>
                </div>
                <div className="bg-white border-2 border-brand-dark p-2 rounded-xl">
                  <div className="text-[10px] font-mono text-gray-400 font-bold uppercase">{language === "es" ? "Repetidas" : "Duplicates"}</div>
                  <div className="font-display font-bold text-lg text-brand-red">{duplicates}</div>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono font-bold text-brand-dark">
                  <span>{language === "es" ? "Completado:" : "Completed:"}</span>
                  <span>{completionPercent}%</span>
                </div>
                <ProgressBar progress={completionPercent} barColor="bg-brand-red" />
              </div>

              {/* Controles de Simulación */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isCompleted}
                  id="btn-play-sim"
                  className="flex-1"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? t("simulator.btnPause") : (language === "es" ? "AUTO-LLENAR" : "AUTO-FILL")}</span>
                </Button>

                <Button
                  onClick={openSinglePack}
                  disabled={isPlaying || isCompleted}
                  id="btn-step-sim"
                  variant="outline"
                  size="md"
                  className="p-2.5 flex items-center justify-center"
                  title={language === "es" ? "Abrir un solo sobre" : "Open one pack"}
                >
                  <Zap size={14} className="text-brand-blue" />
                </Button>

                <Button
                  onClick={resetSimulation}
                  id="btn-reset-sim"
                  variant="outline"
                  size="md"
                  className="p-2.5 hover:bg-red-100 flex items-center justify-center"
                  title={language === "es" ? "Reiniciar simulador" : "Reset simulator"}
                >
                  <RotateCcw size={14} className="text-brand-dark" />
                </Button>
              </div>

              {/* Selector de velocidad */}
              <div className="space-y-1 pt-1">
                <label className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                  {language === "es" ? "Velocidad de Simulación" : "Simulation Speed"}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white border-2 border-brand-dark rounded-lg p-0.5">
                  {[
                    { label: language === "es" ? "Tortuga" : "Turtle", ms: 300 },
                    { label: language === "es" ? "Normal" : "Normal", ms: 120 },
                    { label: language === "es" ? "Rayo" : "Lightning", ms: 25 },
                  ].map((speed) => (
                    <button
                      key={speed.ms}
                      onClick={() => setSimulationSpeed(speed.ms)}
                      className={`py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                        simulationSpeed === speed.ms
                          ? "bg-brand-gold text-brand-dark border border-brand-dark"
                          : "text-gray-400 hover:text-brand-dark"
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Cartel de Completado */}
            {isCompleted && (
              <div className="bg-green-100 border-3 border-brand-dark rounded-2xl p-4 text-center neo-shadow-sm flex flex-col items-center gap-1.5 animate-scale-in">
                <Award className="text-green-700 animate-bounce" size={28} />
                <div className="font-display font-bold text-sm text-green-900">
                  {language === "es" ? "¡ÁLBUM COMPLETADO CON ÉXITO!" : "ALBUM COMPLETED SUCCESSFULLY!"}
                </div>
                <p className="font-mono text-xs text-green-700 leading-tight">
                  {language === "es"
                    ? `Se necesitaron ${packsOpened} sobres en total para completar las ${config.totalStickers} figuritas.`
                    : `It took a total of ${packsOpened} packs to complete all ${config.totalStickers} stickers.`}
                </p>
              </div>
            )}
          </div>

          {/* Lado Derecho: Visualización de slots del álbum */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-brand-dark uppercase tracking-wide">
                  📖 {language === "es" ? "Vista del Álbum" : "Album View"} (Slots {currentGridStart + 1} - {currentGridEnd})
                </h3>
                <span className="font-mono text-[10px] text-gray-400 font-bold">
                  Total: {config.totalStickers} slots
                </span>
              </div>

              {/* Grilla visual con slots */}
              <div className="bg-brand-dark border-3 border-black p-3.5 rounded-2xl grid grid-cols-10 gap-1.5 shadow-inner">
                {Array.from({ length: currentGridEnd - currentGridStart }).map((_, idx) => {
                  const stickerIndex = currentGridStart + idx;
                  const count = album[stickerIndex] || 0;
                  const isOwned = count > 0;
                  const isDuplicated = count > 1;

                  return (
                    <div
                      key={stickerIndex}
                      className={`aspect-square rounded-md border-2 border-black flex flex-col items-center justify-center font-mono text-[9px] font-bold select-none transition-all duration-150 ${
                        isOwned
                          ? isDuplicated
                            ? "bg-brand-red text-white scale-105"
                            : "bg-brand-gold text-brand-dark"
                          : "bg-gray-800 text-gray-500"
                      }`}
                      title={`Sticker #${stickerIndex + 1}: ${count} unidades`}
                    >
                      <span>{stickerIndex + 1}</span>
                      {isDuplicated && <span className="text-[7px] bg-white text-brand-red px-0.5 rounded-sm scale-90">x{count}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paginador de Grilla */}
            {totalGridPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGridPage((p) => Math.max(0, p - 1))}
                  disabled={gridPage === 0}
                  className="px-2 py-1 bg-white border border-brand-dark rounded text-[10px] font-mono font-bold disabled:opacity-50 cursor-pointer"
                >
                  {language === "es" ? "◀ Pág. Anterior" : "◀ Prev. Page"}
                </button>
                <span className="font-mono text-[10px] font-bold text-brand-dark">
                  {t("simulator.page", { page: gridPage + 1, total: totalGridPages })}
                </span>
                <button
                  onClick={() => setGridPage((p) => Math.min(totalGridPages - 1, p + 1))}
                  disabled={gridPage === totalGridPages - 1}
                  className="px-2 py-1 bg-white border border-brand-dark rounded text-[10px] font-mono font-bold disabled:opacity-50 cursor-pointer"
                >
                  {language === "es" ? "Siguiente ▶" : "Next ▶"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Panel Avanzado de Monte Carlo (Simulación masiva) */}
      <div className="bg-brand-cream border-4 border-brand-dark rounded-3xl p-6 md:p-8 neo-shadow space-y-5">
        
        {/* Header Monte Carlo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-brand-dark/20 pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-sm text-brand-dark uppercase tracking-tight flex items-center gap-1.5 italic">
              <BarChart2 size={16} className="text-brand-blue" />
              <span>{t("simulator.mcTitle")}</span>
            </h3>
            <p className="font-sans text-xs text-gray-600 leading-tight">
              {t("simulator.mcDesc")}
            </p>
          </div>

          <div className="shrink-0">
            {isSimulatingBatch ? (
              <Button
                onClick={stopMonteCarloBatch}
                variant="danger"
                size="md"
              >
                <div className="animate-pulse bg-white rounded-full h-2.5 w-2.5"></div>
                <span>{t("simulator.btnStop")}</span>
              </Button>
            ) : (
              <Button
                onClick={runMonteCarloBatch}
                id="btn-run-montecarlo"
                variant="secondary"
                size="lg"
              >
                <span>{t("simulator.btnRun", { runs: runsTarget.toLocaleString() })}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Control del Rango de Simulaciones */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-white border-2 border-brand-dark rounded-2xl p-4">
          <div className="md:col-span-4 space-y-1">
            <label className="font-mono text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-brand-blue" />
              <span>{t("simulator.trialsLabel")}</span>
            </label>
            <p className="text-[10px] text-gray-500 font-mono">
              {t("simulator.trialsDesc")}
            </p>
          </div>
          
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-400 font-bold">1,000</span>
              <span className="px-3 py-1 bg-white border border-brand-dark rounded-full font-mono text-xs font-bold text-brand-blue neo-shadow-sm">
                🎯 {t("simulator.trialsCount", { runs: runsTarget.toLocaleString() })}
              </span>
              <span className="font-mono text-[10px] text-gray-400 font-bold">10,000</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={runsTarget}
              onChange={(e) => setRunsTarget(parseInt(e.target.value))}
              disabled={isSimulatingBatch}
              id="montecarlo-runs-slider"
              className="w-full h-3 bg-brand-cream border-2 border-brand-dark rounded-full cursor-pointer accent-brand-blue"
            />
          </div>
        </div>

        {/* Feedback visual de Procesamiento */}
        {isSimulatingBatch && (
          <div className="space-y-1.5 bg-brand-dark border-2 border-black p-4 rounded-2xl text-white">
            <div className="flex justify-between font-mono text-[11px] font-bold text-brand-dark">
              <span className="flex items-center gap-1 text-gray-300">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-blue animate-ping"></span>
                {t("simulator.realtimeProgress")}
              </span>
              <span className="text-white">
                {batchStats.runs.toLocaleString()} / {runsTarget.toLocaleString()} ({Math.round((batchStats.runs / runsTarget) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 border-2 border-brand-dark p-[2px] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-blue rounded-full transition-all duration-100"
                style={{ width: `${(batchStats.runs / runsTarget) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Resultados del Lote */}
        {batchStats.runs > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
            
            {/* Tarjeta de Datos Empíricos */}
            <div className="md:col-span-4 space-y-3 font-mono">
              <div className="bg-white border-2 border-brand-dark rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-bold text-gray-400 border-b border-gray-100 pb-1.5 uppercase">
                  {t("simulator.empiricalData", { runs: batchStats.runs.toLocaleString() })}
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">{language === "es" ? "SOBRES PROMEDIO:" : "AVERAGE PACKS:"}</span>
                  <span className="font-black text-brand-dark">{batchStats.averagePacks}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">{language === "es" ? "MEJOR ESCENARIO:" : "BEST SCENARIO:"}</span>
                  <span className="font-black text-green-600">{batchStats.minPacks} {language === "es" ? "sobres" : "packs"}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">{language === "es" ? "PEOR ESCENARIO:" : "WORST SCENARIO:"}</span>
                  <span className="font-black text-brand-red">{batchStats.maxPacks} {language === "es" ? "sobres" : "packs"}</span>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-dashed border-gray-200">
                  <span className="text-gray-500 font-bold">{language === "es" ? "INVERSIÓN PROMEDIO:" : "AVERAGE COST:"}</span>
                  <span className="font-black text-brand-blue">
                    {config.currency} {batchStats.averageCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                {config.useSwaps && batchStats.savingsCost > 0 && (
                  <div className="bg-green-50 border border-green-500 rounded-lg p-2 text-[10px] text-green-800 leading-tight flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                    <span>
                      {language === "es"
                        ? `¡Ahorro promedio verificado de ${config.currency} ${batchStats.savingsCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} por persona en intercambios!`
                        : `Verified average savings of ${config.currency} ${batchStats.savingsCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} per person from swapping!`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Campana de Probabilidad Empírica */}
            <div className="md:col-span-8 bg-white border-2 border-brand-dark rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {t("simulator.probBell")}
                </h4>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === "es"
                    ? "Muestra la probabilidad de completar el álbum dentro de rangos específicos de sobres según el experimento."
                    : "Shows the probability of completing the album within specific pack ranges based on the experiment."}
                </p>
              </div>

              {/* Histograma Sencillo por CSS / SVG */}
              {histogramData.length > 0 && (
                <div className="relative h-28 flex items-end justify-between border-b-2 border-brand-dark mt-6 mb-2 px-4">
                  
                  {/* Histograma bars */}
                  {histogramData.map((d, idx) => {
                    const maxCount = Math.max(...histogramData.map((o) => o.count)) || 1;
                    const barHeight = (d.count / maxCount) * 90; // max altura 90px
                    const barWidth = 40;
                    const x = idx * 60 + 20;
                    const y = 100 - barHeight;

                    return (
                      <div key={idx} className="flex flex-col items-center group relative cursor-pointer flex-1">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md neo-shadow-sm whitespace-nowrap z-10 pointer-events-none">
                          {((d.count / batchStats.runs) * 100).toFixed(1)}% ({d.count} runs)
                        </div>
                        
                        {/* Bar Visualizer */}
                        <div 
                          className="w-8 bg-brand-blue border-t-2 border-x-2 border-brand-dark rounded-t-sm transition-all duration-300 group-hover:bg-brand-red"
                          style={{ height: `${barHeight}px` }}
                        />
                        
                        {/* Label range below */}
                        <div className="text-[9px] font-mono text-gray-400 font-bold tracking-tighter mt-1 whitespace-nowrap">
                          {d.range}
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
