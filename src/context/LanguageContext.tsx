/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const translations = {
  es: {
    // Header
    "header.title": "STICKERSTATS",
    "header.methodology": "METODOLOGÍA",

    // Hero Section
    "hero.modelLabel": "MODELO DE COLECCIONISTA DE CUPONES",
    "hero.title": "Simulador de Probabilidades",
    "hero.description": "Descubre cuántos sobres necesitas realmente para completar tu álbum favorito. ¡El impacto de la matemática cooperativa de las figuritas repetidas en tu bolsillo!",

    // ConfigForm
    "config.title": "1. Configura tu Álbum",
    "config.subtitle": "Ingresa las variables de tu colección:",
    "config.country": "País Base",
    "config.currency": "Moneda",
    "config.albumPrice": "Precio del Álbum",
    "config.packPrice": "Precio del Sobre",
    "config.totalStickers": "Cantidad Total de Figuritas",
    "config.stickersPerPack": "Figuritas por Sobre",
    "config.useSwaps": "¿Intercambiarás Repetidas?",
    "config.yesSwaps": "SÍ, con amigos (Eficiencia Colaborativa)",
    "config.noSwaps": "NO, colecciono solo (100% azar)",
    "config.groupSize": "Tamaño del Grupo de Intercambio",
    "config.people": "personas",
    "config.tooltipGroupSize": "A mayor grupo de personas, mayor probabilidad de encontrar repes útiles.",
    "config.reset": "Restablecer",

    // KpiCards
    "kpi.packsTitle": "Sobres a Comprar",
    "kpi.packsSub": "En promedio para completarlo",
    "kpi.stickersTitle": "Figuritas Adquiridas",
    "kpi.stickersSub": "Incluyendo repetidas",
    "kpi.costTitle": "Costo Estimado",
    "kpi.costSub": "Álbum + sobres promedio",
    "kpi.efficiencyTitle": "Eficiencia de Llenado",
    "kpi.efficiencySub": "Figuritas útiles vs compradas",
    "kpi.excellent": "Excelente",
    "kpi.fair": "Mejorable",
    "kpi.solitary": "Solitario",

    // StrategyAdvice
    "strategy.title": "¿Cuál es el Plan? 💡",
    "strategy.activeCoop": "¡Cooperación Activa!",
    "strategy.highCost": "¡Alerta de Gasto Alto!",
    "strategy.swapOnIntro": "Al intercambiar en un grupo de {groupSize} personas, tu inversión disminuye de {solitaryCost} a {averageCost}, ahorrando un {percentage}% en promedio.",
    "strategy.swapOffIntro": "Coleccionar en solitario es extremadamente ineficiente. Si creas un grupo de intercambio de 5 personas, podrías reducir tu gasto promedio a {estimatedCoopCost}, ¡un ahorro de más del 50%!",
    "strategy.callToAction": "¡Busca un grupo de intercambio hoy mismo!",
    "strategy.descSolitary": "La ley de rendimientos decrecientes te hará gastar una fortuna en las últimas figuritas.",
    "strategy.descCooperative": "El intercambio mutuo neutraliza la ineficiencia del final de la curva de coleccionista.",

    // MonteCarloSimulator
    "simulator.title": "Simulador Interactivo de Llenado",
    "simulator.desc": "Abre sobres uno a uno para ver el llenado de tu álbum en tiempo real.",
    "simulator.btnOpenPack": "Abrir 1 Sobre",
    "simulator.btnOpen10Packs": "Abrir 10 Sobres",
    "simulator.btnAuto": "Auto-Llenar",
    "simulator.btnPause": "Pausar",
    "simulator.btnReset": "Limpiar",
    "simulator.speed": "Velocidad:",
    "simulator.need": "Faltan {left} figuritas ({collected}/{total})",
    "simulator.packsOpened": "Sobres Abiertos: {opened}",
    "simulator.investment": "Inversión: {cost}",
    "simulator.albumGrid": "Tu Álbum Digital ({total} casillas)",
    "simulator.page": "Página {page} de {total}",

    "simulator.mcTitle": "Simulación Estadística Avanzada (Monte Carlo)",
    "simulator.mcDesc": "Simula múltiples aperturas completas en tiempo real para modelar con precisión quirúrgica la dispersión empírica y la campana de probabilidades.",
    "simulator.btnStop": "Detener",
    "simulator.btnRun": "Correr {runs} Pruebas",
    "simulator.trialsLabel": "Cantidad de Pruebas",
    "simulator.trialsDesc": "Arrastra para seleccionar entre 1,000 y 10,000 simulaciones.",
    "simulator.trialsCount": "{runs} corridas",
    "simulator.realtimeProgress": "Procesando simulaciones en tiempo real...",
    "simulator.empiricalData": "📊 Datos Empíricos ({runs} corridas)",
    "simulator.avgPacks": "Promedio de Sobres",
    "simulator.avgCost": "Costo Promedio",
    "simulator.minPacks": "Mínimo de Sobres",
    "simulator.maxPacks": "Máximo de Sobres",
    "simulator.swapSavings": "Ahorro por Intercambios",
    "simulator.probBell": "📈 Distribución de Probabilidad (Campana)",
    "simulator.xAxis": "Sobres requeridos",
    "simulator.yAxis": "Frecuencia (Corridas)",

    // MethodologyModal
    "methodology.title": "Metodología Científica",
    "methodology.sec1Title": "El Problema del Coleccionista de Cupones",
    "methodology.sec1Desc1": "La base teórica para calcular el costo de completar un álbum de figuritas es un problema clásico de la teoría de la probabilidad llamado El Problema del Coleccionista de Cupones (Coupon Collector's Problem).",
    "methodology.sec1Desc2": "Si un álbum tiene N figuritas y todas tienen la misma probabilidad de salir, la cantidad promedio (esperanza matemática) de figuritas individuales que debes adquirir para conseguir todas las N únicas se define por la fórmula:",
    "methodology.sec1Desc3": "Donde HN es el número armónico de orden N, calculado como: 1/1 + 1/2 + 1/3 + ... + 1/N. Para un álbum de 638 figuritas, H_638 ≈ 7.03. Esto significa que para llenar el álbum solo, necesitas comprar en promedio unas 4,488 figuritas, ¡lo que equivale a casi 7 veces la capacidad del álbum!",
    "methodology.sec2Title": "La Ley de Rendimientos Decrecientes",
    "methodology.sec2Desc1": "Al principio, cualquier figurita que compras es nueva, por lo que la probabilidad de avanzar es de casi el 100%. Sin embargo, a medida que el álbum se va llenando, la probabilidad de conseguir una figurita nueva disminuye exponencialmente.",
    "methodology.sec2Desc2": "Un dato sorprendente: Cuando te falta solo 1 figurita para terminar un álbum de 638, la probabilidad de que salga en un sobre es de solo 1/638. Esto significa que necesitarás, en promedio, abrir unos 128 sobres más (638 figuritas individuales) ¡solo para conseguir esa última figurita esquiva!",
    "methodology.sec3Title": "La Solución: Economía Colaborativa (Intercambios)",
    "methodology.sec3Desc1": "Cuando los coleccionistas se agrupan, la ineficiencia matemática del tramo final se reduce drásticamente. Al intercambiar repetidas, los excedentes de un coleccionista llenan los vacíos de otro.",
    "methodology.sec3Desc2": "Nuestra aplicación modela esta eficiencia aplicando un factor de reducción estadística que depende del tamaño del grupo G. El porcentaje de reducción de figuritas excedentes se calcula según la siguiente curva de eficiencia:",
    "methodology.people2": "2 Personas",
    "methodology.people5": "5 Personas",
    "methodology.people10": "10+ Personas",
    "methodology.sec3Desc3": "Gracias al intercambio en grupos grandes (ej: 10 personas), el excedente de sobres se reduce hasta en un 65% a 70%, permitiéndote llenar el álbum con una inversión mucho más cercana a la capacidad real del álbum.",
    "methodology.sec4Title": "El Motor de Monte Carlo",
    "methodology.sec4Desc1": "Las fórmulas analíticas son aproximaciones ideales, pero en la vida real, los paquetes contienen figuritas aleatorias sin repetidas dentro del mismo sobre. Para validar los resultados matemáticos teóricos, nuestro simulador incluye un Motor Monte Carlo V4.0.",
    "methodology.sec4Desc2": "Este motor simula por computadora el proceso real de coleccionismo: compra paquetes uno a uno de forma aleatoria, abre las figuritas descartando las repetidas (o enviándolas al pozo común en modo de intercambio) y registra cuántos paquetes se necesitaron para completar el álbum. Correr múltiples simulaciones de forma repetida (ej. 1,000 veces) nos da una distribución real con mínimos, máximos, promedios y variabilidad empírica real.",
    "methodology.understood": "ENTENDIDO",

    // PrivacyModal
    "privacy.title": "Privacidad y Localidad",
    "privacy.intro": "En StickerStats priorizamos la transparencia y el resguardo de tus datos:",
    "privacy.pt1Title": "100% del lado del cliente:",
    "privacy.pt1Desc": "Todos los cálculos y simulaciones de Monte Carlo ocurren en tu propio navegador.",
    "privacy.pt2Title": "Cero Cookies & Rastreadores:",
    "privacy.pt2Desc": "No almacenamos cookies persistentes ni te rastreamos con píxeles publicitarios.",
    "privacy.pt3Title": "Sin Registro ni Cuentas:",
    "privacy.pt3Desc": "No necesitas iniciar sesión ni ingresar correos para usar el simulador premium de forma gratuita.",
    "privacy.disclaimer": "Este sitio web es una calculadora de libre acceso con fines recreativos e instructivos para educar sobre probabilidades estadísticas aplicadas.",
    "privacy.close": "CERRAR",

    // Footer
    "footer.desc": "Herramienta interactiva para analizar el impacto económico y probabilístico de coleccionar álbumes de figuritas en solitario vs. en grupo.",
    "footer.privacy": "PRIVACIDAD"
  },
  en: {
    // Header
    "header.title": "STICKERSTATS",
    "header.methodology": "METHODOLOGY",

    // Hero Section
    "hero.modelLabel": "COUPON COLLECTOR MODEL",
    "hero.title": "Probability Simulator",
    "hero.description": "Find out how many packs you actually need to complete your favorite album. See the real impact of cooperative swapping on your wallet!",

    // ConfigForm
    "config.title": "1. Configure Your Album",
    "config.subtitle": "Enter your collection variables:",
    "config.country": "Base Country",
    "config.currency": "Currency",
    "config.albumPrice": "Album Price",
    "config.packPrice": "Pack Price",
    "config.totalStickers": "Total Stickers in Album",
    "config.stickersPerPack": "Stickers per Pack",
    "config.useSwaps": "Will You Swap Duplicates?",
    "config.yesSwaps": "YES, with friends (Collaborative Efficiency)",
    "config.noSwaps": "NO, collecting alone (100% luck)",
    "config.groupSize": "Swapping Group Size",
    "config.people": "people",
    "config.tooltipGroupSize": "A larger group of people means a higher probability of finding useful swaps.",
    "config.reset": "Reset",

    // KpiCards
    "kpi.packsTitle": "Packs to Buy",
    "kpi.packsSub": "Average needed to complete",
    "kpi.stickersTitle": "Stickers Acquired",
    "kpi.stickersSub": "Including duplicates",
    "kpi.costTitle": "Estimated Cost",
    "kpi.costSub": "Album + average packs",
    "kpi.efficiencyTitle": "Filling Efficiency",
    "kpi.efficiencySub": "Useful vs purchased stickers",
    "kpi.excellent": "Excellent",
    "kpi.fair": "Improvable",
    "kpi.solitary": "Solitary",

    // StrategyAdvice
    "strategy.title": "What's the Plan? 💡",
    "strategy.activeCoop": "Active Cooperation!",
    "strategy.highCost": "High Cost Alert!",
    "strategy.swapOnIntro": "By swapping in a group of {groupSize} people, your investment decreases from {solitaryCost} to {averageCost}, saving {percentage}% on average.",
    "strategy.swapOffIntro": "Collecting alone is extremely inefficient. If you create a swap group of 5 people, you could reduce your average cost to {estimatedCoopCost}, saving over 50%!",
    "strategy.callToAction": "Find a swapping group today!",
    "strategy.descSolitary": "The law of diminishing returns will make you spend a fortune on the last few stickers.",
    "strategy.descCooperative": "Mutual swapping neutralizes the inefficiency of the end of the collector curve.",

    // MonteCarloSimulator
    "simulator.title": "Interactive Filling Simulator",
    "simulator.desc": "Open packs one by one to watch your album fill up in real time.",
    "simulator.btnOpenPack": "Open 1 Pack",
    "simulator.btnOpen10Packs": "Open 10 Packs",
    "simulator.btnAuto": "Auto-Fill",
    "simulator.btnPause": "Pause",
    "simulator.btnReset": "Reset",
    "simulator.speed": "Speed:",
    "simulator.need": "Need {left} stickers ({collected}/{total})",
    "simulator.packsOpened": "Packs Opened: {opened}",
    "simulator.investment": "Investment: {cost}",
    "simulator.albumGrid": "Your Digital Album ({total} slots)",
    "simulator.page": "Page {page} of {total}",

    "simulator.mcTitle": "Advanced Statistical Simulation (Monte Carlo)",
    "simulator.mcDesc": "Simulate multiple full openings in real-time to model the empirical dispersion and probability bell curve with surgical precision.",
    "simulator.btnStop": "Stop",
    "simulator.btnRun": "Run {runs} Trials",
    "simulator.trialsLabel": "Number of Trials",
    "simulator.trialsDesc": "Drag to select between 1,000 and 10,000 simulations.",
    "simulator.trialsCount": "{runs} trials",
    "simulator.realtimeProgress": "Processing simulations in real-time...",
    "simulator.empiricalData": "📊 Empirical Data ({runs} trials)",
    "simulator.avgPacks": "Average Packs",
    "simulator.avgCost": "Average Cost",
    "simulator.minPacks": "Minimum Packs",
    "simulator.maxPacks": "Maximum Packs",
    "simulator.swapSavings": "Savings from Swapping",
    "simulator.probBell": "📈 Probability Distribution (Bell Curve)",
    "simulator.xAxis": "Packs required",
    "simulator.yAxis": "Frequency (Trials)",

    // MethodologyModal
    "methodology.title": "Scientific Methodology",
    "methodology.sec1Title": "The Coupon Collector's Problem",
    "methodology.sec1Desc1": "The theoretical basis for calculating the cost of completing a sticker album is a classic probability problem called the Coupon Collector's Problem.",
    "methodology.sec1Desc2": "If an album has N stickers and all have the same probability, the average quantity (mathematical expectation) of individual stickers you must acquire to get all N unique ones is defined by the formula:",
    "methodology.sec1Desc3": "Where HN is the harmonic number of order N, calculated as: 1/1 + 1/2 + 1/3 + ... + 1/N. For an album of 638 stickers, H_638 ≈ 7.03. This means that to fill the album alone, you need to buy an average of 4,488 stickers, which is almost 7 times the capacity of the album!",
    "methodology.sec2Title": "The Law of Diminishing Returns",
    "methodology.sec2Desc1": "At first, any sticker you buy is new, so the probability of moving forward is almost 100%. However, as the album fills up, the probability of getting a new sticker decreases exponentially.",
    "methodology.sec2Desc2": "A surprising fact: When you need just 1 sticker to complete a 638 album, the probability of it appearing in a pack is only 1/638. This means you will need, on average, to open about 128 more packs (638 individual stickers) just to get that last elusive sticker!",
    "methodology.sec3Title": "The Solution: Collaborative Economy (Swapping)",
    "methodology.sec3Desc1": "When collectors group up, the mathematical inefficiency of the final stretch is drastically reduced. By swapping duplicates, one collector's excess fills another's gaps.",
    "methodology.sec3Desc2": "Our app models this efficiency by applying a statistical reduction factor that depends on the group size G. The percentage reduction in excess stickers is calculated using the following efficiency curve:",
    "methodology.people2": "2 People",
    "methodology.people5": "5 People",
    "methodology.people10": "10+ People",
    "methodology.sec3Desc3": "Thanks to swapping in large groups (e.g., 10 people), the excess of packs is reduced by up to 65% to 70%, allowing you to fill the album with an investment much closer to the actual capacity of the album.",
    "methodology.sec4Title": "The Monte Carlo Engine",
    "methodology.sec4Desc1": "Analytical formulas are ideal approximations, but in real life, packs contain random stickers without duplicates inside the same pack. To validate theoretical mathematical results, our simulator includes a Monte Carlo Engine V4.0.",
    "methodology.sec4Desc2": "This computer engine simulates the real collecting process: it buys packs one by one randomly, opens stickers discarding duplicates (or sending them to the swap pool in swapping mode) and records how many packs were needed to complete the album. Running multiple simulations repeatedly (e.g., 1,000 times) gives us a real distribution with minimums, maximums, averages, and real empirical variability.",
    "methodology.understood": "UNDERSTOOD",

    // PrivacyModal
    "privacy.title": "Privacy and Locality",
    "privacy.intro": "At StickerStats, we prioritize transparency and safeguarding your data:",
    "privacy.pt1Title": "100% Client-Side:",
    "privacy.pt1Desc": "All calculations and Monte Carlo simulations occur right in your own browser.",
    "privacy.pt2Title": "Zero Cookies & Trackers:",
    "privacy.pt2Desc": "We do not store persistent cookies or track you with advertising pixels.",
    "privacy.pt3Title": "No Registration or Accounts:",
    "privacy.pt3Desc": "You do not need to log in or enter emails to use the premium simulator for free.",
    "privacy.disclaimer": "This website is a free-access calculator for recreational and educational purposes to teach applied statistical probabilities.",
    "privacy.close": "CLOSE",

    // Footer
    "footer.desc": "Interactive tool to analyze the economic and probabilistic impact of collecting sticker albums alone vs. in a group.",
    "footer.privacy": "PRIVACY"
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Check local storage
    const saved = localStorage.getItem("stickerstats_lang");
    if (saved === "es" || saved === "en") {
      return saved;
    }
    // 2. Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage || "";
    if (browserLang.toLowerCase().startsWith("es")) {
      return "es";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("stickerstats_lang", lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const langTranslations = translations[language];
    let val = (langTranslations as Record<string, string>)[key] || (translations["es"] as Record<string, string>)[key] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([vKey, vVal]) => {
        val = val.replace(new RegExp(`{${vKey}}`, "g"), String(vVal));
      });
    }
    return val;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
