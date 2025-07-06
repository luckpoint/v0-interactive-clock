import { useCallback } from "react"
import { formatTime, parseTimeString, convertTo24Hour, isAM, getDisplayHour } from "../lib/clock-utils"

export interface UseClockEditProps {
  time: { hours: number; minutes: number; seconds: number }
  is24HourMode: boolean
  showSecondHand: boolean
  isEditing: boolean
  editValue: string
  setTime: React.Dispatch<React.SetStateAction<{ hours: number; minutes: number; seconds: number }>>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setEditValue: React.Dispatch<React.SetStateAction<string>>
  setIsClockRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export const useClockEdit = ({
  time,
  is24HourMode,
  showSecondHand,
  isEditing,
  editValue,
  setTime,
  setIsEditing,
  setEditValue,
  setIsClockRunning,
}: UseClockEditProps) => {
  const handleEditStart = useCallback(() => {
    setIsEditing(true)
    setIsClockRunning(false)

    const displayHour = getDisplayHour(time.hours, is24HourMode)
    const currentTimeString = formatTime(displayHour, time.minutes, time.seconds, is24HourMode, showSecondHand)
    setEditValue(currentTimeString)
  }, [time, is24HourMode, showSecondHand, setIsEditing, setIsClockRunning, setEditValue])

  const handleEditComplete = useCallback(() => {
    if (!isEditing) return

    const parsedTime = parseTimeString(editValue, showSecondHand)
    
    if (parsedTime) {
      let { hours, minutes, seconds } = parsedTime
      
      // 12時間表記の場合、24時間表記に変換
      if (!is24HourMode) {
        const isAMTime = isAM(time.hours)
        hours = convertTo24Hour(hours, isAMTime, is24HourMode)
      }

      setTime({ hours, minutes, seconds })
    }

    setIsEditing(false)
  }, [editValue, showSecondHand, is24HourMode, time.hours, isEditing, setTime, setIsEditing])

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEditComplete()
      } else if (e.key === "Escape") {
        setIsEditing(false)
      }
    },
    [handleEditComplete, setIsEditing]
  )

  return {
    handleEditStart,
    handleEditComplete,
    handleEditKeyDown,
  }
}