import { useState, useEffect, useCallback } from 'react'
import { 
  detectMobileDevice, 
  getTouchSensitivity, 
  getOptimalClockSize, 
  getTouchAreaExpansion,
  enableHapticFeedback,
  type MobileDetection 
} from '../lib/mobile-utils'

export interface MobileOptimizationState {
  deviceInfo: MobileDetection
  touchSensitivity: number
  clockSize: { width: number; height: number }
  touchAreaExpansion: number
  isLandscape: boolean
  viewportSize: { width: number; height: number }
}

export interface MobileOptimizationActions {
  triggerHapticFeedback: (type?: 'light' | 'medium' | 'heavy') => void
  updateViewportSize: () => void
}

const initialDeviceInfo: MobileDetection = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  hasTouch: false,
  platform: 'unknown',
};

export const useMobileOptimization = (): MobileOptimizationState & MobileOptimizationActions & { isClient: boolean } => {
  const [isClient, setIsClient] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<MobileDetection>(initialDeviceInfo)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [isLandscape, setIsLandscape] = useState(false)

  // 初期化とリサイズ処理
  useEffect(() => {
    setIsClient(true);
    setDeviceInfo(detectMobileDevice())
    
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth
        const height = window.innerHeight
        setViewportSize({ width, height })
        setIsLandscape(width > height)
      }
    }

    updateViewport()
    
    const handleResize = () => {
      updateViewport()
      // デバイス情報も更新（画面回転時など）
      setDeviceInfo(detectMobileDevice())
    }

    const handleOrientationChange = () => {
      // orientation change の後に少し遅延を入れてサイズを更新
      setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  const touchSensitivity = getTouchSensitivity(deviceInfo)
  const clockSize = getOptimalClockSize(deviceInfo)
  const touchAreaExpansion = getTouchAreaExpansion(deviceInfo)

  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    enableHapticFeedback(type)
  }, [])

  const updateViewportSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight })
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
  }, [])

  return {
    deviceInfo,
    touchSensitivity,
    clockSize,
    touchAreaExpansion,
    isLandscape,
    viewportSize,
    isClient,
    triggerHapticFeedback,
    updateViewportSize,
  }
}