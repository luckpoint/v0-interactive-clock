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
  const { deviceInfo, triggerHapticFeedback, isClient, isLandscape } = useMobileOptimization()
  const t = getTranslations(language)

  const handleButtonClick = (action: () => void) => {
    triggerHapticFeedback('light')
    action()
  }

  // モバイル向けボタンスタイル（hydration問題を回避）
  const mobileButtonClass = isClient && deviceInfo.isMobile
    ? "py-4 px-4 text-sm min-h-[44px] min-w-[44px]" // モバイル
    : isClient && deviceInfo.isTablet && isLandscape
    ? "py-3 px-5 text-xl min-h-[60px]" // タブレット横向き（タイム調整ボタンに合わせる）
    : isClient && deviceInfo.isTablet
    ? "py-4 px-6 text-2xl min-h-[72px]" // タブレット縦向き
    : "py-3 px-6 text-base"

  const baseButtonClass = `bg-white/70 hover:bg-white/90 text-gray-700 font-light rounded-xl transition-all duration-300 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${mobileButtonClass}`

  // 秒針表示/非表示ボタンのラベル
  const getSecondHandLabel = () => {
    return language === 'ja' ? 'びょうしん' : 'Second Hand'
  }

  // ラベル生成関数
  const getTimeFormatLabel = () => {
    if (is24HourMode) {
      // 現在24時間表示 → AM/PM 表示ボタン
      return language === 'ja' ? 'ごぜん・ごご' : 'AM/PM'
    }
    // 現在AM/PM表示 → 24時間表示ボタン
    return language === 'ja' ? '24じかん' : '24-Hour'
  }

  const getClockMovementLabel = () => {
    if (isClockRunning) {
      // 動作中 → Stop ボタン
      return language === 'ja' ? 'とめる' : 'Stop'
    }
    // 停止中 → Start ボタン
    return language === 'ja' ? 'うごかす' : 'Start'
  }

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
              {getTimeFormatLabel()}
            </span>
          </button>

          <button
            onClick={() => handleButtonClick(onToggleSecondHand)}
            className={`${baseButtonClass}`}
          >
            <span>{getSecondHandLabel()}</span>
          </button>

          <button
            onClick={() => handleButtonClick(onToggleClockMovement)}
            className={`${baseButtonClass}`}
          >
            <span>{getClockMovementLabel()}</span>
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
          {getTimeFormatLabel()}
        </button>

        <button
          onClick={() => handleButtonClick(onToggleSecondHand)}
          className={`${baseButtonClass}`}
        >
          {getSecondHandLabel()}
        </button>

        <button
          onClick={() => handleButtonClick(onToggleClockMovement)}
          className={`${baseButtonClass}`}
        >
          {getClockMovementLabel()}
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