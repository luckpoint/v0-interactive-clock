import { useRef, useEffect } from 'react'
import { cn } from '../lib/utils'
import { useMobileOptimization } from '../hooks/useMobileOptimization'
import { useSwipeGestures } from '../hooks/useSwipeGestures'
import { CLOCK_DIMENSIONS } from '../lib/constants'
import { type ThemeKey } from '../lib/themes'

export interface MobileOptimizedClockProps {
  clockRef: React.RefObject<SVGSVGElement>
  width: number
  height: number
  children: React.ReactNode
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  isDragging: boolean
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
  isDragging,
  onThemeChange,
  onTimeFormatToggle,
  currentTheme,
}: MobileOptimizedClockProps) {
  const { deviceInfo, clockSize, triggerHapticFeedback, touchAreaExpansion } = useMobileOptimization()
  const containerRef = useRef<HTMLDivElement>(null)

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
    disabled: isDragging,
    config: {
      minDistance: deviceInfo.isMobile ? 30 : 50,
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
    triggerHapticFeedback('light')
    onTouchEnd()
  }

  // デバイスに応じたサイズ調整
  const optimizedWidth = deviceInfo.isMobile || deviceInfo.isTablet ? clockSize.width : width
  const optimizedHeight = deviceInfo.isMobile || deviceInfo.isTablet ? clockSize.height : height

  // タッチ領域の拡大スタイル
  const touchEnhancementStyle = deviceInfo.hasTouch ? {
    padding: `${touchAreaExpansion}px`,
    margin: `-${touchAreaExpansion}px`,
  } : {}

  return (
    <div 
      ref={containerRef}
      className="relative mb-4 sm:mb-6 md:mb-8"
      style={touchEnhancementStyle}
    >
      {/* スワイプヒント（モバイルのみ） */}
      {deviceInfo.isMobile && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center">
          <div>👆 上: 時間形式切替</div>
          <div>👈👉 左右: テーマ変更</div>
        </div>
      )}

      <svg
        ref={clockRef}
        width={optimizedWidth}
        height={optimizedHeight}
        viewBox={`0 0 ${CLOCK_DIMENSIONS.WIDTH} ${CLOCK_DIMENSIONS.HEIGHT}`}
        className={cn(
          "mx-auto cursor-pointer select-none touch-none transition-all duration-200",
          deviceInfo.isMobile ? "drop-shadow-xl" : "drop-shadow-2xl",
          isDragging && "scale-105"
        )}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchStart={handleTouchStartWithFeedback}
        onTouchEnd={handleTouchEndWithFeedback}
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
      {isDragging && deviceInfo.hasTouch && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-blue-400 rounded-full opacity-50 animate-pulse" />
        </div>
      )}
    </div>
  )
}