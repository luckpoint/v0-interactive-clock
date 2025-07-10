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

  /*
   * To provide more balanced sizing we will derive the size from the
   * smaller side of the viewport. This gives us a consistent look in
   * both portrait and landscape orientations.
   */
  const minDimension = Math.min(viewportWidth, viewportHeight)

  // === Mobile / small screens (<= 768px) ===
  if (deviceInfo.isMobile || viewportWidth <= 768) {
    const isLandscape = viewportWidth > viewportHeight

    if (isLandscape) {
      // Landscape: reduce further to fit vertical space
      const maxSize = Math.min(minDimension * 0.48, 240)
      return { width: maxSize, height: maxSize }
    }

    // Portrait: use 80% of the smaller dimension, cap at 320px for compact phones
    const maxSize = Math.min(minDimension * 0.8, 320)
    return { width: maxSize, height: maxSize }
  }

  // === Large tablets (e.g. iPad Pro 11/12.9) ===
  // We treat tablets whose shorter edge is >= 800px as "large" tablets.
  if (deviceInfo.isTablet && minDimension >= 800) {
    const isLandscape = viewportWidth > viewportHeight

    if (isLandscape) {
      // In landscape mode use a smaller ratio to fit the UI comfortably
      const maxSize = Math.min(viewportHeight * 0.65, 600)
      return { width: maxSize, height: maxSize }
    }

    const maxSize = Math.min(minDimension * 0.85, 900)
    return { width: maxSize, height: maxSize }
  }

  // === Regular tablets ===
  if (deviceInfo.isTablet) {
    // Detect orientation (landscape if width > height)
    const isLandscape = viewportWidth > viewportHeight

    if (isLandscape) {
      /*
       * In landscape mode, vertical space is limited. Reduce the size so that
       * the clock plus the additional UI (digital display, buttons, etc.) can
       * fit inside the viewport height. Empirically 55-60% of the viewport
       * height yields a good balance on common tablet resolutions (e.g.
       * 1024×768, 1366×1024).
       */
      const maxSize = Math.min(viewportHeight * 0.6, 500)
      return { width: maxSize, height: maxSize }
    }

    // Portrait – use 75% of the shorter edge, cap at 700px (existing behaviour)
    const maxSize = Math.min(minDimension * 0.75, 700)
    return { width: maxSize, height: maxSize }
  }

  // === Desktop ===
  // Reduce size by ~20% for desktop: 0.3 → 0.24, cap 500px
  const maxSize = Math.min(viewportWidth * 0.24, 500)
  return { width: maxSize, height: maxSize }
}

export const getTouchAreaExpansion = (deviceInfo: MobileDetection): number => {
  // タッチ領域を拡大してタップしやすくする
  if (deviceInfo.isMobile) return 20
  if (deviceInfo.isTablet) return 15
  return 5
}