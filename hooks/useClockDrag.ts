import { useCallback } from "react"
import { getAngleFromPosition, angleToHourAndMinute, angleToMinute } from "../lib/clock-utils"

export interface UseClockDragProps {
  isDragging: "hour" | "minute" | null
  currentHours: number
  prevHourAngle: number
  setTime: React.Dispatch<React.SetStateAction<{ hours: number; minutes: number; seconds: number }>>
  setIsDragging: React.Dispatch<React.SetStateAction<"hour" | "minute" | null>>
  setIsClockRunning: React.Dispatch<React.SetStateAction<boolean>>
  updateTimeWithMinuteRotation: (newMinute: number) => void
}

export const useClockDrag = ({
  isDragging,
  currentHours,
  prevHourAngle,
  setTime,
  setIsDragging,
  setIsClockRunning,
  updateTimeWithMinuteRotation,
}: UseClockDragProps) => {
  const handleMouseDown = useCallback((hand: "hour" | "minute") => {
    console.log(`Drag started - setting isDragging to ${hand}`)
    setIsDragging(hand)
    setIsClockRunning(false)
  }, [setIsDragging, setIsClockRunning])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, clockRef: React.RefObject<SVGSVGElement | null>) => {
      if (!isDragging || !clockRef.current) return

      const angle = getAngleFromPosition(e.clientX, e.clientY, clockRef.current)

      if (isDragging === "hour") {
        const { hours, minutes } = angleToHourAndMinute(angle, currentHours, prevHourAngle)
        setTime((prev) => ({ ...prev, hours, minutes }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        updateTimeWithMinuteRotation(newMinute)
      }
    },
    [isDragging, currentHours, prevHourAngle, setTime, updateTimeWithMinuteRotation]
  )

  const handleMouseUp = useCallback(() => {
    console.log('Drag ended - resetting isDragging to null')
    setIsDragging(null)
  }, [setIsDragging])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent, clockRef: React.RefObject<SVGSVGElement | null>) => {
      if (!isDragging || e.touches.length === 0 || !clockRef.current) return

      // SVGにtouchAction: 'none'を設定しているため、preventDefault()は不要
      // e.preventDefault()

      const touch = e.touches[0]
      const angle = getAngleFromPosition(touch.clientX, touch.clientY, clockRef.current)

      if (isDragging === "hour") {
        const { hours, minutes } = angleToHourAndMinute(angle, currentHours, prevHourAngle)
        setTime((prev) => ({ ...prev, hours, minutes }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        updateTimeWithMinuteRotation(newMinute)
      }
    },
    [isDragging, currentHours, prevHourAngle, setTime, updateTimeWithMinuteRotation]
  )

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
  }
}