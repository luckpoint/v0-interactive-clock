import { useState, useEffect, useCallback, useRef } from "react"
import { getCurrentTime, shouldUpdateHour, calculateNewHour, type Time } from "../lib/clock-utils"
import { detectLanguage, type Language } from "../lib/i18n"
import { type ThemeKey } from "../lib/themes"

export interface UseClockState {
  time: Time
  isDragging: "hour" | "minute" | null
  is24HourMode: boolean
  language: Language
  currentTheme: ThemeKey
  showSecondHand: boolean
  isClockRunning: boolean
  isEditing: boolean
  editValue: string
  prevMinuteRef: React.MutableRefObject<number>
  prevHourAngleRef: React.MutableRefObject<number>
}

export interface UseClockActions {
  setTime: React.Dispatch<React.SetStateAction<Time>>
  setIsDragging: React.Dispatch<React.SetStateAction<"hour" | "minute" | null>>
  setIs24HourMode: React.Dispatch<React.SetStateAction<boolean>>
  setLanguage: React.Dispatch<React.SetStateAction<Language>>
  setCurrentTheme: React.Dispatch<React.SetStateAction<ThemeKey>>
  setShowSecondHand: React.Dispatch<React.SetStateAction<boolean>>
  setIsClockRunning: React.Dispatch<React.SetStateAction<boolean>>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setEditValue: React.Dispatch<React.SetStateAction<string>>
  updateTimeWithMinuteRotation: (newMinute: number) => void
  resetToCurrentTime: () => void
}

export const useClock = (): UseClockState & UseClockActions => {
  // 固定の初期時刻を使用してhydrationエラーを回避
  const [time, setTime] = useState<Time>({ hours: 12, minutes: 0, seconds: 0 })
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null)
  const [is24HourMode, setIs24HourMode] = useState<boolean>(false)
  const [language, setLanguage] = useState<Language>("en")
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("warm")
  const [showSecondHand, setShowSecondHand] = useState<boolean>(true)
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editValue, setEditValue] = useState<string>("")
  const [isHydrated, setIsHydrated] = useState<boolean>(false)
  
  const prevMinuteRef = useRef<number>(0)
  const prevHourAngleRef = useRef<number>(0)

  // クライアントサイドでのハイドレーション完了を検出
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // ハイドレーション完了後に現在時刻で初期化
  useEffect(() => {
    if (isHydrated) {
      const currentTime = getCurrentTime()
      setTime(currentTime)

      // ハッシュから言語を判定 (#lang=ja / #lang=en)
      const parseHashLang = (): Language | null => {
        if (typeof window === 'undefined') return null
        const hash = window.location.hash
        if (hash.startsWith('#lang=')) {
          const value = hash.replace('#lang=', '')
          return value === 'ja' ? 'ja' : value === 'en' ? 'en' : null
        }
        return null
      }

      const hashLang = parseHashLang()
      setLanguage(hashLang ?? detectLanguage())

      // ハッシュ変更を監視して言語を更新
      const handleHashChange = () => {
        const newLang = parseHashLang()
        if (newLang) {
          setLanguage(newLang)
        }
      }
      window.addEventListener('hashchange', handleHashChange)

      // クリーンアップ
      return () => {
        window.removeEventListener('hashchange', handleHashChange)
      }
    }
  }, [isHydrated])

  // リアルタイム時計の更新
  useEffect(() => {
    if (!isHydrated || isDragging || !isClockRunning || isEditing) return

    const interval = setInterval(() => {
      const currentTime = getCurrentTime()
      setTime(currentTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [isHydrated, isDragging, isClockRunning, isEditing])

  // timeが外部から変更された時にrefを同期
  useEffect(() => {
    prevMinuteRef.current = time.minutes
    const currentHourAngle = ((time.hours % 12) * 30 + time.minutes * 0.5) % 360
    prevHourAngleRef.current = currentHourAngle
  }, [time.minutes, time.hours])

  // 分針の回転方向を検出して時間を更新
  const updateTimeWithMinuteRotation = useCallback((newMinute: number) => {
    const prevMinute = prevMinuteRef.current

    if (shouldUpdateHour(prevMinute, newMinute)) {
      setTime((prev) => {
        const newHours = calculateNewHour(prev.hours, prevMinute, newMinute)
        return { ...prev, hours: newHours, minutes: newMinute }
      })
    } else {
      setTime((prev) => ({ ...prev, minutes: newMinute }))
    }

    prevMinuteRef.current = newMinute
  }, [])

  const resetToCurrentTime = useCallback(() => {
    const currentTime = getCurrentTime()
    setTime(currentTime)
  }, [])

  return {
    // State
    time,
    isDragging,
    is24HourMode,
    language,
    currentTheme,
    showSecondHand,
    isClockRunning,
    isEditing,
    editValue,
    prevMinuteRef,
    prevHourAngleRef,
    // Actions
    setTime,
    setIsDragging,
    setIs24HourMode,
    setLanguage,
    setCurrentTheme,
    setShowSecondHand,
    setIsClockRunning,
    setIsEditing,
    setEditValue,
    updateTimeWithMinuteRotation,
    resetToCurrentTime,
  }
}