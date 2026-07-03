/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlbumConfig {
  country: string;
  currency: string;
  albumPrice: number;
  packPrice: number;
  totalStickers: number;
  stickersPerPack: number;
  useSwaps: boolean;
  groupSize: number;
}

export interface CalculationResult {
  totalStickersNeeded: number;
  packsNeeded: number;
  packsCost: number;
  totalCost: number;
  savingsPacks: number;
  savingsCost: number;
  savingsPercent: number;
  reductionFactor: number;
}

export interface PresetAlbum {
  name: string;
  country: string;
  currency: string;
  albumPrice: number;
  packPrice: number;
  totalStickers: number;
  stickersPerPack: number;
}

export interface SimulationStep {
  packsOpened: number;
  stickersCollected: number;
  duplicates: number;
  completionPercent: number;
  isCompleted: boolean;
}

export interface MonteCarloStats {
  runs: number;
  averagePacks: number;
  minPacks: number;
  maxPacks: number;
  averageCost: number;
  savingsCost: number;
}
