import { useMobileOptimization } from '../hooks/useMobileOptimization'
import { getTranslations, type Language } from '../lib/i18n'
import { themes, type ThemeKey } from '../lib/themes'

export interface MobileControlPanelProps {
  language: Language
  is24HourMode: boolean
  showSecondHand: boolean
  isClockRunning: boolean
  currentTheme: ThemeKey
  onToggleTimeFormat: () => void
  onToggleSecondHand: () => void
  onToggleClockMovement: () => void
  onResetTime: () => void
  onThemeChange: (theme: ThemeKey) => void
}

export default function MobileControlPanel({
  language,
  is24HourMode,
  showSecondHand,
  isClockRunning,
  currentTheme,
  onToggleTimeFormat,
  onToggleSecondHand,
  onToggleClockMovement,
  onResetTime,
  onThemeChange,
}: MobileControlPanelProps) {
  const { deviceInfo, triggerHapticFeedback } = useMobileOptimization()
  const t = getTranslations(language)
  const theme = themes[currentTheme]

  const handleButtonClick = (action: () => void) => {
    triggerHapticFeedback('light')
    action()
  }

  // モバイル向けボタンスタイル
  const mobileButtonClass = deviceInfo.isMobile
    ? "py-4 px-4 text-sm min-h-[44px] min-w-[44px]" // Apple HIG準拠の最小タッチターゲット
    : deviceInfo.isTablet
    ? "py-3 px-5 text-base min-h-[48px]" // Material Design準拠
    : "py-3 px-6 text-base"

  const baseButtonClass = `${theme.buttonBg} text-gray-700 font-light rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${mobileButtonClass}`

  // モバイルレイアウトを強制表示（デバイス検出に関係なく）
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768
  
  if (deviceInfo.isMobile || isSmallScreen) {
    return (
      <div className="w-full max-w-sm space-y-3">
        {/* 主要コントロール */}
        <div className="space-y-2">
          <button
            onClick={() => handleButtonClick(onToggleTimeFormat)}
            className={`${baseButtonClass} w-full`}
          >
            <span className="text-sm">{t.toggleTimeFormat}</span>
            <span className="text-xs opacity-80">
              {is24HourMode ? t.twelveHourFormat : t.twentyFourHourFormat}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleButtonClick(onToggleSecondHand)}
              className={`${baseButtonClass} text-xs`}
            >
              <span>{t.toggleSecondHand}</span>
            </button>

            <button
              onClick={() => handleButtonClick(onResetTime)}
              className={`${baseButtonClass} text-xs`}
            >
              {t.resetButton}
            </button>
          </div>
        </div>

        {/* テーマ選択（簡素化） */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm">
          <h3 className="text-center text-gray-700 font-light mb-2 text-xs">🎨 テーマ</h3>
          <div className="flex gap-2 justify-center">
            {Object.entries(themes).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => handleButtonClick(() => onThemeChange(key as ThemeKey))}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                  currentTheme === key ? "border-gray-700 shadow-md scale-110" : "border-gray-300"
                }`}
                style={{
                  background:
                    key === "warm"
                      ? "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)"
                      : key === "cool"
                      ? "linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)"
                      : key === "nature"
                      ? "linear-gradient(135deg, #059669, #10b981, #84cc16)"
                      : key === "elegant"
                      ? "linear-gradient(135deg, #7c3aed, #8b5cf6, #6366f1)"
                      : "linear-gradient(135deg, #ec4899, #f472b6, #fb7185)",
                }}
                title={themeData.name}
                aria-label={`${themeData.name}テーマを選択`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // タブレット・デスクトップ向けレイアウト
  return (
    <div className="space-y-6">
      {/* ボタンエリア */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => handleButtonClick(onToggleTimeFormat)}
          className={baseButtonClass}
        >
          {t.toggleTimeFormat} {is24HourMode ? t.twelveHourFormat : t.twentyFourHourFormat}
        </button>

        <button
          onClick={() => handleButtonClick(onToggleSecondHand)}
          className={baseButtonClass}
        >
          {t.toggleSecondHand} {showSecondHand ? t.hideSecondHand : t.showSecondHand}
        </button>

        <button
          onClick={() => handleButtonClick(onToggleClockMovement)}
          className={baseButtonClass}
        >
          {t.toggleClockMovement} {isClockRunning ? t.stopClock : t.startClock}
        </button>

        <button
          onClick={() => handleButtonClick(onResetTime)}
          className={baseButtonClass}
        >
          {t.resetButton}
        </button>
      </div>

      {/* テーマ選択 */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-gray-200/40 shadow-sm">
        <h3 className="text-center text-gray-700 font-light mb-3 text-base">🎨 テーマを選択</h3>
        <div className="flex gap-3 justify-center flex-wrap">
          {Object.entries(themes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => handleButtonClick(() => onThemeChange(key as ThemeKey))}
              className={`w-12 h-12 rounded-full border-4 transition-all duration-300 transform hover:scale-110 ${
                currentTheme === key ? "border-gray-600 shadow-lg scale-105" : "border-gray-300 hover:border-gray-400"
              }`}
              style={{
                background:
                  key === "warm"
                    ? "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)"
                    : key === "cool"
                    ? "linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)"
                    : key === "nature"
                    ? "linear-gradient(135deg, #059669, #10b981, #84cc16)"
                    : key === "elegant"
                    ? "linear-gradient(135deg, #7c3aed, #8b5cf6, #6366f1)"
                    : "linear-gradient(135deg, #ec4899, #f472b6, #fb7185)",
              }}
              title={themeData.name}
              aria-label={`${themeData.name}テーマを選択`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}