export type DragState = "hour" | "minute" | null

export interface ClockDimensions {
  width: number
  height: number
  radius: number
  center: { x: number; y: number }
}

export interface Position {
  x: number
  y: number
}

export interface TouchEvent {
  clientX: number
  clientY: number
}

export interface MouseEvent {
  clientX: number
  clientY: number
}

export type HandType = "hour" | "minute" | "second"

export interface ClockConstants {
  DEGREES_PER_HOUR: 30
  DEGREES_PER_MINUTE: 6
  DEGREES_PER_SECOND: 6
  MINUTES_PER_HOUR: 60
  HOURS_PER_DAY: 24
  HOURS_PER_HALF_DAY: 12
  SVG_COORDINATE_OFFSET: -90
  CIRCLE_DEGREES: 360
  CROSS_TWELVE_THRESHOLD: 180
}

export interface ClockState {
  time: {
    hours: number
    minutes: number
    seconds: number
  }
  isDragging: DragState
  is24HourMode: boolean
  showSecondHand: boolean
  isClockRunning: boolean
  isEditing: boolean
  editValue: string
}

export interface ClockProps {
  initialTime?: {
    hours: number
    minutes: number
    seconds: number
  }
  theme?: string
  language?: string
  is24HourMode?: boolean
  showSecondHand?: boolean
  onTimeChange?: (time: { hours: number; minutes: number; seconds: number }) => void
}