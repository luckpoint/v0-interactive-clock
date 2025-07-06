export interface Translations {
  title: string
  hourHandInstruction: string
  minuteHandInstruction: string
  toggleTimeFormat: string
  resetButton: string
  twelveHourFormat: string
  twentyFourHourFormat: string
  twentyFourHourLabel: string
  toggleSecondHand: string
  showSecondHand: string
  hideSecondHand: string
  toggleClockMovement: string
  startClock: string
  stopClock: string
  selectTheme: string
  selectThemeLabel: string
}

export type Language = 'en' | 'ja'

export const translations: Record<Language, Translations> = {
  en: {
    title: "Interactive Clock",
    hourHandInstruction: "🔴 Drag the red hand (hour hand) to set the time",
    minuteHandInstruction: "🔵 Drag the blue hand (minute hand) to set the minutes",
    toggleTimeFormat: "🕒",
    resetButton: "⏰ Reset to Current Time",
    twelveHourFormat: "12-Hour Format",
    twentyFourHourFormat: "24-Hour Format",
    twentyFourHourLabel: "24-Hour Format",
    toggleSecondHand: "⏱️",
    showSecondHand: "Show Second Hand",
    hideSecondHand: "Hide Second Hand",
    toggleClockMovement: "⚙️",
    startClock: "Start Clock",
    stopClock: "Stop Clock",
    selectTheme: "🎨 Select Theme",
    selectThemeLabel: "Select {themeName} theme",
  },
  ja: {
    title: "インタラクティブ時計",
    hourHandInstruction: "🔴 赤い針（時針）をドラッグして時間を設定",
    minuteHandInstruction: "🔵 青い針（分針）をドラッグして分を設定",
    toggleTimeFormat: "🕒",
    resetButton: "⏰ 現在時刻にリセット",
    twelveHourFormat: "12時間表記",
    twentyFourHourFormat: "24時間表記",
    twentyFourHourLabel: "24時間表記",
    toggleSecondHand: "⏱️",
    showSecondHand: "秒針を表示",
    hideSecondHand: "秒針を非表示",
    toggleClockMovement: "⚙️",
    startClock: "時計を動かす",
    stopClock: "時計を止める",
    selectTheme: "🎨 テーマを選択",
    selectThemeLabel: "{themeName}のテーマを選択",
  },
}

export const detectLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const browserLang = navigator.language || navigator.languages?.[0] || "en"
    return browserLang.toLowerCase().startsWith("ja") ? "ja" : "en"
  }
  return "en"
}

export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.en
}