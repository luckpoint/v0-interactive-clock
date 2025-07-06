import { useMobileOptimization } from '../hooks/useMobileOptimization'
import { getTranslations, type Language } from '../lib/i18n'

export interface MobileControlPanelProps {
  language: Language
  is24HourMode: boolean
  showSecondHand: boolean
  isClockRunning: boolean
  onToggleTimeFormat: () => void
  onToggleSecondHand: () => void
  onToggleClockMovement: () => void
  onResetTime: () => void
}

export default function MobileControlPanel({
  language,
  is24HourMode,
  showSecondHand,
  isClockRunning,
  onToggleTimeFormat,
  onToggleSecondHand,
  onToggleClockMovement,
  onResetTime,
}: MobileControlPanelProps) {
  const { deviceInfo, triggerHapticFeedback, isClient } = useMobileOptimization()
  const t = getTranslations(language)

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

  const baseButtonClass = `bg-white/70 hover:bg-white/90 text-gray-700 font-light rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${mobileButtonClass}`

  // クライアントサイドでのみ画面幅を確認
  const isSmallScreen = isClient && typeof window !== 'undefined' && window.innerWidth <= 768
  
  if (isClient && (deviceInfo.isMobile || isSmallScreen)) {
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
              <span>{showSecondHand ? t.hideSecondHand : t.showSecondHand}</span>
            </button>

            <button
              onClick={() => handleButtonClick(onToggleClockMovement)}
              className={`${baseButtonClass} text-xs`}
            >
              <span>{isClockRunning ? t.stopClock : t.startClock}</span>
            </button>
          </div>

          <button
            onClick={() => handleButtonClick(onResetTime)}
            className={`${baseButtonClass} w-full text-xs`}
          >
            {t.resetButton}
          </button>
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


    </div>
  )
}