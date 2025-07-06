import { useState, useEffect, useCallback, useRef } from 'react'

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right' | null
  distance: number
  velocity: number
}

export interface SwipeGestureConfig {
  minDistance: number // 最小スワイプ距離
  maxDuration: number // 最大スワイプ時間（ms）
  minVelocity: number // 最小速度（px/ms）
}

export interface UseSwipeGesturesProps {
  onSwipe?: (direction: SwipeDirection) => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  config?: Partial<SwipeGestureConfig>
  disabled?: boolean
}

const defaultConfig: SwipeGestureConfig = {
  minDistance: 50,
  maxDuration: 500,
  minVelocity: 0.1,
}

export const useSwipeGestures = ({
  onSwipe,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  config = {},
  disabled = false,
}: UseSwipeGesturesProps) => {
  const swipeConfig = { ...defaultConfig, ...config }
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  const calculateSwipe = useCallback(
    (startX: number, startY: number, endX: number, endY: number, duration: number): SwipeDirection => {
      const deltaX = endX - startX
      const deltaY = endY - startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = distance / duration

      if (distance < swipeConfig.minDistance || duration > swipeConfig.maxDuration || velocity < swipeConfig.minVelocity) {
        return { direction: null, distance: 0, velocity: 0 }
      }

      // 主要な方向を決定
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      let direction: 'up' | 'down' | 'left' | 'right'
      if (absDeltaX > absDeltaY) {
        direction = deltaX > 0 ? 'right' : 'left'
      } else {
        direction = deltaY > 0 ? 'down' : 'up'
      }

      return { direction, distance, velocity }
    },
    [swipeConfig]
  )

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (disabled || event.touches.length !== 1) return

      const touch = event.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }
      setIsTracking(true)
    },
    [disabled]
  )

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (disabled || !touchStartRef.current || !isTracking) return

      const touch = event.changedTouches[0]
      const endTime = Date.now()
      const duration = endTime - touchStartRef.current.time

      const swipeResult = calculateSwipe(
        touchStartRef.current.x,
        touchStartRef.current.y,
        touch.clientX,
        touch.clientY,
        duration
      )

      if (swipeResult.direction) {
        onSwipe?.(swipeResult)

        switch (swipeResult.direction) {
          case 'up':
            onSwipeUp?.()
            break
          case 'down':
            onSwipeDown?.()
            break
          case 'left':
            onSwipeLeft?.()
            break
          case 'right':
            onSwipeRight?.()
            break
        }
      }

      touchStartRef.current = null
      setIsTracking(false)
    },
    [disabled, isTracking, calculateSwipe, onSwipe, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]
  )

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null
    setIsTracking(false)
  }, [])

  const bindSwipeEvents = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return

      element.addEventListener('touchstart', handleTouchStart, { passive: false })
      element.addEventListener('touchend', handleTouchEnd, { passive: false })
      element.addEventListener('touchcancel', handleTouchCancel, { passive: false })

      return () => {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchend', handleTouchEnd)
        element.removeEventListener('touchcancel', handleTouchCancel)
      }
    },
    [handleTouchStart, handleTouchEnd, handleTouchCancel]
  )

  return {
    bindSwipeEvents,
    isTracking,
  }
}