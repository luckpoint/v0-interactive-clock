import { type ReactNode } from 'react'
import { useMobileOptimization } from '../hooks/useMobileOptimization'

export interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  const { deviceInfo, isLandscape, viewportSize } = useMobileOptimization()

  // デバイスタイプに応じたコンテナクラス
  const getContainerClasses = () => {
    const baseClasses = "flex flex-col items-center"
    
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
      const landscapeClasses = isLandscape 
        ? "flex-row justify-center gap-6 px-4 py-3" 
        : "justify-center p-4"
      return `${baseClasses} min-h-screen ${landscapeClasses} ${className}`
    }
    
    // デスクトップ向け
    return `${baseClasses} justify-center min-h-screen p-4 sm:p-6 md:p-8 ${className}`
  }

  return (
    <div className={getContainerClasses()}>
      {children}
    </div>
  )
}