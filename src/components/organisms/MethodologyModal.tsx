/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, BookOpen, Target, Users, BarChart3, HelpCircle } from "lucide-react";
import Button from "../atoms/Button";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl border-4 border-brand-dark neo-shadow overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        
        {/* Header */}
        <div className="bg-brand-red border-b-4 border-brand-dark px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen size={20} className="stroke-[2.5]" />
            <h2 className="font-display font-bold text-lg tracking-tight uppercase">
              Metodología Científica
            </h2>
          </div>
          <button
            onClick={onClose}
            id="btn-close-methodology"
            className="w-8 h-8 rounded-full bg-white border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-gold hover:scale-105 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-sans text-sm text-gray-800">
          
          {/* Section 1: Coupon Collector */}
          <div className="space-y-2 border-b-2 border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-brand-blue font-display font-bold text-base">
              <Target size={18} />
              <h3>El Problema del Coleccionista de Cupones</h3>
            </div>
            <p className="leading-relaxed">
              La base teórica para calcular el costo de completar un álbum de figuritas es un problema clásico de la teoría de la probabilidad llamado <strong>El Problema del Coleccionista de Cupones</strong> (<em>Coupon Collector's Problem</em>).
            </p>
            <p className="leading-relaxed">
              Si un álbum tiene <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-brand-red font-bold">N</code> figuritas y todas tienen la misma probabilidad de salir, la cantidad promedio (esperanza matemática) de figuritas individuales que debes adquirir para conseguir todas las <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-brand-red font-bold">N</code> únicas se define por la fórmula:
            </p>
            <div className="bg-brand-cream border-2 border-brand-dark rounded-xl p-4 my-2 text-center font-mono font-bold text-lg neo-shadow-sm">
              Total Esperado = N × H<sub>N</sub>
            </div>
            <p className="leading-relaxed text-xs text-gray-600">
              Donde <code className="font-mono font-bold">H<sub>N</sub></code> es el <strong>número armónico</strong> de orden N, calculado como: <code className="font-mono">1/1 + 1/2 + 1/3 + ... + 1/N</code>. Para un álbum de 638 figuritas, <code className="font-mono">H<sub>638</sub> ≈ 7.03</code>. Esto significa que para llenar el álbum solo, necesitas comprar en promedio unas <span className="font-bold text-brand-red">4,488 figuritas</span>, ¡lo que equivale a casi 7 veces la capacidad del álbum!
            </p>
          </div>

          {/* Section 2: End-of-Curve Inefficiency */}
          <div className="space-y-2 border-b-2 border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-brand-red font-display font-bold text-base">
              <HelpCircle size={18} />
              <h3>La Ley de Rendimientos Decrecientes</h3>
            </div>
            <p className="leading-relaxed">
              Al principio, cualquier figurita que compras es nueva, por lo que la probabilidad de avanzar es de casi el 100%. Sin embargo, a medida que el álbum se va llenando, la probabilidad de conseguir una figurita nueva disminuye exponencialmente.
            </p>
            <p className="leading-relaxed text-xs bg-red-50 border-l-4 border-brand-red p-3 rounded-r-lg">
              <strong>Un dato sorprendente:</strong> Cuando te falta solo <span className="font-bold text-brand-red">1 figurita</span> para terminar un álbum de 638, la probabilidad de que salga en un sobre es de solo <code className="font-mono font-bold">1/638</code>. Esto significa que necesitarás, en promedio, abrir unos <strong>128 sobres más</strong> (638 figuritas individuales) ¡solo para conseguir esa última figurita esquiva!
            </p>
          </div>

          {/* Section 3: Community Swapping */}
          <div className="space-y-2 border-b-2 border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-brand-blue font-display font-bold text-base">
              <Users size={18} />
              <h3>La Solución: Economía Colaborativa (Intercambios)</h3>
            </div>
            <p className="leading-relaxed">
              Cuando los coleccionistas se agrupan, la ineficiencia matemática del tramo final se reduce drásticamente. Al intercambiar repetidas, los excedentes de un coleccionista llenan los vacíos de otro.
            </p>
            <p className="leading-relaxed">
              Nuestra aplicación modela esta eficiencia aplicando un factor de reducción estadística que depende del tamaño del grupo <code className="font-mono font-bold">G</code>. El porcentaje de reducción de figuritas excedentes se calcula según la siguiente curva de eficiencia:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold mt-2">
              <div className="bg-gray-100 border-2 border-brand-dark p-2 rounded-lg neo-shadow-sm">
                <div className="text-gray-500">2 Personas</div>
                <div className="text-brand-blue text-sm">-30% Excedente</div>
              </div>
              <div className="bg-gray-100 border-2 border-brand-dark p-2 rounded-lg neo-shadow-sm">
                <div className="text-gray-500">5 Personas</div>
                <div className="text-brand-blue text-sm">-50% Excedente</div>
              </div>
              <div className="bg-gray-100 border-2 border-brand-dark p-2 rounded-lg neo-shadow-sm">
                <div className="text-gray-500">10+ Personas</div>
                <div className="text-brand-blue text-sm">-65% Excedente</div>
              </div>
            </div>
            <p className="leading-relaxed text-xs mt-2 text-gray-600">
              Gracias al intercambio en grupos grandes (ej: 10 personas), el excedente de sobres se reduce hasta en un 65% a 70%, permitiéndote llenar el álbum con una inversión mucho más cercana a la capacidad real del álbum.
            </p>
          </div>

          {/* Section 4: Monte Carlo Engine */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-display font-bold text-base">
              <BarChart3 size={18} />
              <h3>El Motor de Monte Carlo</h3>
            </div>
            <p className="leading-relaxed">
              Las fórmulas analíticas son aproximaciones ideales, pero en la vida real, los paquetes contienen figuritas aleatorias sin repetidas dentro del mismo sobre. Para validar los resultados matemáticos teóricos, nuestro simulador incluye un **Motor Monte Carlo V4.0**.
            </p>
            <p className="leading-relaxed">
              Este motor simula por computadora el proceso real de coleccionismo: compra paquetes uno a uno de forma aleatoria, abre las figuritas descartando las repetidas (o enviándolas al pozo común en modo de intercambio) y registra cuántos paquetes se necesitaron para completar el álbum. Correr múltiples simulaciones de forma repetida (ej. 1,000 veces) nos da una distribución real con mínimos, máximos, promedios y variabilidad empírica real.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-brand-cream border-t-4 border-brand-dark px-6 py-4 flex justify-end">
          <Button
            onClick={onClose}
            id="btn-close-methodology-footer"
            variant="primary"
            size="sm"
          >
            ENTENDIDO
          </Button>
        </div>

      </div>
    </div>
  );
}
