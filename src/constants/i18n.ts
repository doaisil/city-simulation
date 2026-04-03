const translations = {
  en: {
    brand: 'Evreka',
    subtitle: 'City Simulator',
    parameters: 'Parameters',
    trucks: 'Trucks',
    containers: 'Containers',
    collectionFrequency: 'Collection Frequency',
    perWeek: '/ week',
    routeMethod: 'Route Method',
    dynamic: 'Dynamic',
    static: 'Static',
    freqDaily: 'Daily',
    freq3x: '3x / week',
    freq1x: '1x / week',
    liveKpis: 'Live KPIs',
    totalDistance: 'Total Distance',
    fuelConsumption: 'Fuel Consumption',
    co2Emissions: 'CO₂ Emissions',
    collectionTime: 'Collection Time',
    optimizeButton: 'Optimize with Evreka AI',
    resetButton: 'Reset Simulation',
    openEditor: 'Open Map Editor',
    // Popup
    routesOptimized: 'Routes Optimized!',
    popupDescription: 'Evreka AI has optimized your waste collection routes',
    viewCity: 'View Optimized City',
    saved: 'saved',
    // Units
    km: 'km',
    l: 'L',
    kg: 'kg',
    hrs: 'hrs',
  },
  tr: {
    brand: 'Evreka',
    subtitle: 'Şehir Simülatörü',
    parameters: 'Parametreler',
    trucks: 'Araçlar',
    containers: 'Konteynerler',
    collectionFrequency: 'Toplama Sıklığı',
    perWeek: '/ hafta',
    routeMethod: 'Rota Yöntemi',
    dynamic: 'Dinamik',
    static: 'Statik',
    freqDaily: 'Her gün',
    freq3x: '3x / hafta',
    freq1x: '1x / hafta',
    liveKpis: 'Canlı KPI\'lar',
    totalDistance: 'Toplam Mesafe',
    fuelConsumption: 'Yakıt Tüketimi',
    co2Emissions: 'CO₂ Emisyonu',
    collectionTime: 'Toplama Süresi',
    optimizeButton: 'Evreka AI ile Optimize Et',
    resetButton: 'Simülasyonu Sıfırla',
    openEditor: 'Harita Düzenleyici',
    // Popup
    routesOptimized: 'Rotalar Optimize Edildi!',
    popupDescription: 'Evreka AI atık toplama rotalarınızı optimize etti',
    viewCity: 'Optimize Edilmiş Şehri Gör',
    saved: 'tasarruf',
    // Units
    km: 'km',
    l: 'L',
    kg: 'kg',
    hrs: 'saat',
  },
} as const;

export type Lang = 'en' | 'tr';
export type TranslationKey = keyof typeof translations.en;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key];
}
