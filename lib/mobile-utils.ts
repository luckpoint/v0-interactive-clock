export interface TouchPoint {
  x: number
  y: number
  identifier: number
}

export interface MobileDetection {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasTouch: boolean
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
}

export const detectMobileDevice = (): MobileDetection => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      platform: 'unknown'
    }
  }

  const userAgent = window.navigator.userAgent
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  
  // Android detection
  const isAndroid = /Android/.test(userAgent)
  
  // Tablet detection
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent) ||
    (window.innerWidth >= 768 && hasTouch)
  
  // Mobile detection
  const isMobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(userAgent) && !isTablet
  
  let platform: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown'
  if (isIOS) platform = 'ios'
  else if (isAndroid) platform = 'android'
  else if (!isMobile && !isTablet) platform = 'desktop'

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    hasTouch,
    platform
  }
}

export const getTouchSensitivity = (deviceInfo: MobileDetection): number => {
  if (deviceInfo.isMobile) return 0.8 // より感度を高く
  if (deviceInfo.isTablet) return 0.9
  return 1.0 // デスクトップは標準
}

export const getMinimumTouchTarget = (deviceInfo: MobileDetection): number => {
  // Apple Human Interface Guidelines: 44pt minimum
  // Material Design: 48dp minimum
  if (deviceInfo.platform === 'ios') return 44
  if (deviceInfo.platform === 'android') return 48
  return 32 // デスクトップは小さくてもOK
}

export const enableHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  if (typeof window === 'undefined') return
  
  // Vibration API (主にAndroid)
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    navigator.vibrate(patterns[type])
  }
  
  // iOS Haptic Feedback (Web では限定的)
  // 注: iOS Safari では Web Vibration API は利用不可
  // PWAとして実装する場合のみ利用可能
}

export const preventScrollOnTouch = (element: HTMLElement): void => {
  element.addEventListener('touchmove', (e) => {
    e.preventDefault()
  }, { passive: false })
  
  element.addEventListener('touchstart', (e) => {
    e.stopPropagation()
  }, { passive: true })
}

export const getOptimalClockSize = (deviceInfo: MobileDetection): { width: number; height: number } => {
  if (typeof window === 'undefined') {
    return { width: 320, height: 320 }
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // 画面サイズに基づいた判定も追加
  const isSmallScreen = viewportWidth <= 768
  
  if (deviceInfo.isMobile || isSmallScreen) {
    // モバイル/小画面では画面幅の70%、最大250px
    const maxSize = Math.min(viewportWidth * 0.7, 250)
    return { width: maxSize, height: maxSize }
  }
  
  if (deviceInfo.isTablet) {
    // タブレットでは少し大きめ
    const maxSize = Math.min(viewportWidth * 0.6, 360)
    return { width: maxSize, height: maxSize }
  }
  
  // デスクトップは標準サイズ
  return { width: 320, height: 320 }
}

export const getTouchAreaExpansion = (deviceInfo: MobileDetection): number => {
  // タッチ領域を拡大してタップしやすくする
  if (deviceInfo.isMobile) return 20
  if (deviceInfo.isTablet) return 15
  return 5
}