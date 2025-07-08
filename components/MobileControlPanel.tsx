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

  // モバイル向けボタンスタイル（hydration問題を回避）
  const mobileButtonClass = isClient && deviceInfo.isMobile
    ? "py-4 px-4 text-sm min-h-[44px] min-w-[44px]" // Apple HIG準拠の最小タッチターゲット
    : isClient && deviceInfo.isTablet
    ? "py-4 px-6 text-lg min-h-[56px]" // タブレット向け大きめサイズ
    : "py-3 px-6 text-base"

  const baseButtonClass = `bg-white/70 hover:bg-white/90 text-gray-700 font-light rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${mobileButtonClass}`

  // クライアントサイドでのみ画面幅を確認
  const isSmallScreen = isClient && typeof window !== 'undefined' && window.innerWidth <= 768
  
  if (isClient && (deviceInfo.isMobile || isSmallScreen)) {
    return (
      <div className="w-full max-w-sm">
        {/* 2列2行のグリッドレイアウト */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleButtonClick(onToggleTimeFormat)}
            className={`${baseButtonClass}`}
          >
            <span>
              {is24HourMode ? "24-Hour → AM/PM" : "AM/PM → 24-Hour"}
            </span>
          </button>

          <button
            onClick={() => handleButtonClick(onToggleSecondHand)}
            className={`${baseButtonClass}`}
          >
            <span>Second Hand</span>
          </button>

          <button
            onClick={() => handleButtonClick(onToggleClockMovement)}
            className={`${baseButtonClass}`}
          >
            <span>Stop Clock</span>
          </button>

          <button
            onClick={() => handleButtonClick(onResetTime)}
            className={`${baseButtonClass}`}
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
          className={`${baseButtonClass}`}
        >
          {is24HourMode ? "24-Hour → AM/PM" : "AM/PM → 24-Hour"}
        </button>

        <button
          onClick={() => handleButtonClick(onToggleSecondHand)}
          className={`${baseButtonClass}`}
        >
          Second Hand
        </button>

        <button
          onClick={() => handleButtonClick(onToggleClockMovement)}
          className={`${baseButtonClass}`}
        >
          Stop Clock
        </button>

        <button
          onClick={() => handleButtonClick(onResetTime)}
          className={`${baseButtonClass}`}
        >
          {t.resetButton}
        </button>
      </div>


    </div>
  )
}