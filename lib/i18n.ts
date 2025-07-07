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
  selectThemeLabel: string
  help: string
  helpTitle: string
  helpContent: {
    basic: string
    dragHands: string
    editTime: string
    controls: string
    themes: string
  }
  close: string
}

export type Language = 'en' | 'ja'

export const translations: Record<Language, Translations> = {
  en: {
    title: "Fun Clock",
    hourHandInstruction: "🔴 Drag the hour hand to adjust time",
    minuteHandInstruction: "🔵 Drag the minute hand to adjust minutes",
    toggleTimeFormat: "Toggle Time Format",
    resetButton: "Reset to Current Time",
    twelveHourFormat: "12 Hour Format",
    twentyFourHourFormat: "24 Hour Format",
    twentyFourHourLabel: "24 Hour Format",
    toggleSecondHand: "Toggle Second Hand",
    showSecondHand: "Show Second Hand",
    hideSecondHand: "Hide Second Hand",
    toggleClockMovement: "Toggle Clock Movement",
    startClock: "Start Clock",
    stopClock: "Stop Clock",
    selectThemeLabel: "Select {themeName} theme",
    help: "Help",
    helpTitle: "How to Use the Clock",
    helpContent: {
      basic: "This clock can be operated interactively.",
      dragHands: "• Drag the hour hand (red) and minute hand (blue) to adjust time",
      editTime: "• Double-click the digital display to edit time directly",
      controls: "• You can toggle between 12/24 hour format and show/hide the second hand",
      themes: "• Select various themes from the dropdown in the top-right corner"
    },
    close: "Close"
  },
  ja: {
    title: "たのしいとけい",
    hourHandInstruction: "🔴 時針をドラッグして時間を調整",
    minuteHandInstruction: "🔵 分針をドラッグして分を調整",
    toggleTimeFormat: "時間表示切り替え",
    resetButton: "現在時刻にリセット",
    twelveHourFormat: "12時間表示",
    twentyFourHourFormat: "24時間表示",
    twentyFourHourLabel: "24時間表示",
    toggleSecondHand: "秒針の表示/非表示",
    showSecondHand: "秒針を表示",
    hideSecondHand: "秒針を非表示",
    toggleClockMovement: "時計の動作切り替え",
    startClock: "時計を開始",
    stopClock: "時計を停止",
    selectThemeLabel: "{themeName}テーマを選択",
    help: "ヘルプ",
    helpTitle: "時計の使い方",
    helpContent: {
      basic: "この時計はインタラクティブに操作できます。",
      dragHands: "• 時針（赤）と分針（青）をドラッグして時間を調整できます",
      editTime: "• デジタル表示をダブルクリックで直接時間を編集できます",
      controls: "• 時間表示形式（12時間/24時間）や秒針の表示を切り替えられます",
      themes: "• 右上のドロップダウンから様々なテーマを選択できます"
    },
    close: "閉じる"
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