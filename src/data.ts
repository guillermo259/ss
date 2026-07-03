/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetAlbum, AlbumConfig, CalculationResult } from "./types";

export const COUNTRIES_OPTIONS = [
  { name: "Colombia", code: "CO", currency: "COP", albumPrice: 15000, packPrice: 4500 },
  { name: "Venezuela", code: "VE", currency: "VES", albumPrice: 180, packPrice: 40 },
  { name: "Argentina", code: "AR", currency: "ARS", albumPrice: 5000, packPrice: 1000 },
  { name: "Chile", code: "CL", currency: "CLP", albumPrice: 3000, packPrice: 900 },
  { name: "México", code: "MX", currency: "MXN", albumPrice: 120, packPrice: 35 },
  { name: "USA", code: "US", currency: "USD", albumPrice: 3.99, packPrice: 1.50 },
  { name: "Perú", code: "PE", currency: "PEN", albumPrice: 10, packPrice: 3.50 },
  { name: "Ecuador", code: "EC", currency: "USD", albumPrice: 4.0, packPrice: 1.20 },
  { name: "España", code: "ES", currency: "EUR", albumPrice: 4.5, packPrice: 1.00 }
];

export const CURRENCIES_OPTIONS = [
  { code: "ARS", label: "ARS ($)" },
  { code: "USD", label: "USD ($)" },
  { code: "COP", label: "COP ($)" },
  { code: "VES", label: "VES (Bs.)" },
  { code: "CLP", label: "CLP ($)" },
  { code: "MXN", label: "MXN ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "PEN", label: "PEN (S/.)" }
];

/**
 * Calcula la suma armónica para el número N (H_N) de forma exacta
 * H_N = 1/1 + 1/2 + ... + 1/N
 */
export function calculateHarmonicNumber(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += 1 / i;
  }
  return sum;
}

/**
 * Obtiene el factor de reducción estadística basado en el tamaño del grupo (G)
 * basándose en la ineficiencia eliminada por intercambio grupal.
 * Ejemplos:
 * - 1 persona: 0% de reducción
 * - 2 personas: 30% de reducción
 * - 5 personas: 50% de reducción
 * - 10 personas: 65% de reducción
 * - 20 personas: 73% de reducción
 */
export function getSwapReductionFactor(groupSize: number): number {
  if (groupSize <= 1) return 0;
  if (groupSize === 2) return 0.30;
  if (groupSize === 3) return 0.40;
  if (groupSize === 4) return 0.46;
  if (groupSize === 5) return 0.50;
  if (groupSize === 6) return 0.54;
  if (groupSize === 7) return 0.58;
  if (groupSize === 8) return 0.61;
  if (groupSize === 9) return 0.63;
  if (groupSize === 10) return 0.65;
  
  // Interpolación o escala suave para grupos entre 11 y 20
  if (groupSize <= 15) {
    return 0.65 + (groupSize - 10) * 0.01; // g=15 -> 70%
  }
  return Math.min(0.75, 0.70 + (groupSize - 15) * 0.006); // g=20 -> 73%
}

/**
 * Lógica matemática para calcular el costo de completar el álbum
 */
export function calculateAlbumStats(config: AlbumConfig): CalculationResult {
  const N = config.totalStickers;
  const F = config.stickersPerPack;
  
  // 1. Número Armónico para N
  const hN = calculateHarmonicNumber(N);
  
  // 2. Figuritas totales estimadas necesarias en solitario (N * H_N)
  const totalStickersNeededSolitary = N * hN;
  
  // 3. Paquetes necesarios en solitario
  const packsNeededSolitary = totalStickersNeededSolitary / F;
  
  // 4. Mínimo teórico absoluto de figuritas (sin ninguna repetida)
  const minStickersNeeded = N;
  const minPacksNeeded = minStickersNeeded / F;
  
  // 5. Exceso debido a repetidas
  const excessPacksSolitary = packsNeededSolitary - minPacksNeeded;
  
  // 6. Aplicación de la reducción de intercambio comunitario
  let reductionFactor = 0;
  let packsNeededFinal = packsNeededSolitary;
  
  if (config.useSwaps) {
    reductionFactor = getSwapReductionFactor(config.groupSize);
    // Reducimos el exceso por el factor de reducción del grupo
    const reducedExcessPacks = excessPacksSolitary * (1 - reductionFactor);
    packsNeededFinal = minPacksNeeded + reducedExcessPacks;
  }
  
  // Aseguramos que sea al menos el mínimo absoluto y redondeamos hacia arriba para tener paquetes completos
  packsNeededFinal = Math.ceil(Math.max(minPacksNeeded, packsNeededFinal));
  const packsNeededSolitaryRounded = Math.ceil(packsNeededSolitary);
  
  // Costos
  const packsCost = packsNeededFinal * config.packPrice;
  const totalCost = config.albumPrice + packsCost;
  
  // Ahorro
  const savingsPacks = Math.max(0, packsNeededSolitaryRounded - packsNeededFinal);
  const savingsCost = savingsPacks * config.packPrice;
  const savingsPercent = config.useSwaps 
    ? (savingsCost / (config.albumPrice + packsNeededSolitaryRounded * config.packPrice)) * 100 
    : 0;

  return {
    totalStickersNeeded: packsNeededFinal * F,
    packsNeeded: packsNeededFinal,
    packsCost,
    totalCost,
    savingsPacks,
    savingsCost,
    savingsPercent,
    reductionFactor
  };
}
