import { type ReactNode } from 'react'
import { useMobileOptimization } from '../hooks/useMobileOptimization'

export interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  const { deviceInfo, isLandscape, viewportSize, isClient } = useMobileOptimization()

  // デバイスタイプに応じたコンテナクラス（hydration問題を回避）
  const getContainerClasses = () => {
    const baseClasses = "flex flex-col items-center"
    
    // クライアントサイドの初期化が完了するまではデスクトップ向けを使用
    if (!isClient) {
      return `${baseClasses} justify-center min-h-screen p-4 sm:p-6 md:p-8 ${className}`
    }
    
    // モバイル向けのコンテナ調整
    if (deviceInfo.isMobile) {
      // 縦長の場合は上から配置、横長の場合は中央配置
      if (isLandscape) {
        return `${baseClasses} min-h-screen justify-center gap-2 px-2 py-2 ${className}`
      }
      return `${baseClasses} min-h-screen justify-start pt-2 pb-4 px-2 gap-2 ${className}`
    }
    
    // タブレット向け
    if (deviceInfo.isTablet) {
      return `${baseClasses} min-h-screen justify-center p-4 ${className}`
    }
    
    // デスクトップ向け - 常に縦向きレイアウト
    return `${baseClasses} justify-center min-h-screen p-4 sm:p-6 md:p-8 ${className}`
  }

  return (
    <div className={getContainerClasses()}>
      {children}
    </div>
  )
}