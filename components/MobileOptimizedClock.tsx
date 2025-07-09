import { useRef, useEffect } from 'react'
import { cn } from '../lib/utils'
import { useMobileOptimization } from '../hooks/useMobileOptimization'
import { useSwipeGestures } from '../hooks/useSwipeGestures'
import { CLOCK_DIMENSIONS } from '../lib/constants'
import { type ThemeKey } from '../lib/themes'

export interface MobileOptimizedClockProps {
  clockRef: React.RefObject<SVGSVGElement | null>
  width: number
  height: number
  children: React.ReactNode
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onTouchCancel?: () => void
  isDragging: "hour" | "minute" | null
  onThemeChange?: (direction: 'next' | 'prev') => void
  onTimeFormatToggle?: () => void
  currentTheme: ThemeKey
}

export default function MobileOptimizedClock({
  clockRef,
  width,
  height,
  children,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  isDragging,
  onThemeChange,
  onTimeFormatToggle,
  currentTheme,
}: MobileOptimizedClockProps) {
  const { deviceInfo, clockSize, triggerHapticFeedback, touchAreaExpansion, isClient } = useMobileOptimization()
  const containerRef = useRef<HTMLDivElement>(null)

  // デバッグ用：ドラッグ状態の変化を追跡
  useEffect(() => {
    console.log('MobileOptimizedClock: isDragging changed to:', isDragging)
  }, [isDragging])

  // スワイプジェスチャーの設定
  const { bindSwipeEvents } = useSwipeGestures({
    onSwipeLeft: () => {
      triggerHapticFeedback('light')
      onThemeChange?.('next')
    },
    onSwipeRight: () => {
      triggerHapticFeedback('light')
      onThemeChange?.('prev')
    },
    onSwipeUp: () => {
      triggerHapticFeedback('light')
      onTimeFormatToggle?.()
    },
    disabled: isDragging !== null,
    config: {
      minDistance: isClient && deviceInfo.isMobile ? 30 : 50,
      minVelocity: 0.1,
    }
  })

  // スワイプイベントの設定
  useEffect(() => {
    if (containerRef.current) {
      const cleanup = bindSwipeEvents(containerRef.current)
      return cleanup
    }
  }, [bindSwipeEvents])

  // タッチ操作時のハプティクフィードバック
  const handleTouchStartWithFeedback = (e: React.TouchEvent) => {
    triggerHapticFeedback('light')
    onTouchStart(e)
  }

  const handleTouchEndWithFeedback = () => {
    console.log('Touch ended - calling onTouchEnd')
    triggerHapticFeedback('light')
    onTouchEnd()
  }

  // タッチキャンセル時の処理
  const handleTouchCancelWithFeedback = () => {
    console.log('Touch cancelled - calling onTouchCancel or onTouchEnd')
    triggerHapticFeedback('light')
    onTouchCancel?.() || onTouchEnd() // タッチがキャンセルされた時もドラッグを終了
  }

  // デバイスに応じたサイズ調整（hydration問題を回避）
  const optimizedWidth = isClient ? clockSize.width : width
  const optimizedHeight = isClient ? clockSize.height : height

  // タッチ領域の拡大スタイル（hydration問題を回避）
  const touchEnhancementStyle = isClient && deviceInfo.hasTouch ? {
    padding: `${touchAreaExpansion}px`,
    margin: `-${touchAreaExpansion}px`,
  } : {}

  return (
    <div 
      ref={containerRef}
      className="relative mb-4 sm:mb-6 md:mb-8"
      style={touchEnhancementStyle}
    >


      <svg
        ref={clockRef}
        width={optimizedWidth}
        height={optimizedHeight}
        viewBox={`0 0 ${CLOCK_DIMENSIONS.WIDTH} ${CLOCK_DIMENSIONS.HEIGHT}`}
        className={cn(
          "mx-auto cursor-pointer select-none touch-none transition-all duration-200",
          isDragging !== null && "scale-105"
        )}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchStart={handleTouchStartWithFeedback}
        onTouchEnd={handleTouchEndWithFeedback}
        onTouchCancel={handleTouchCancelWithFeedback}
        style={{
          // タッチデバイスでのスムーズな操作のためのスタイル
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {children}
      </svg>

      {/* ドラッグ中のビジュアルフィードバック */}
      {isDragging !== null && isClient && deviceInfo.hasTouch && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-blue-400 rounded-full opacity-50 animate-pulse" />
          {/* 針の種類を示すテキスト */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {isDragging === "hour" ? "時針を調整中" : "分針を調整中"}
          </div>
        </div>
      )}
    </div>
  )
}