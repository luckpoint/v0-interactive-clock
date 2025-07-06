export interface Time {
  hours: number // 0-23の24時間形式
  minutes: number // 0-59
  seconds: number // 0-59
}

export interface HourAngleResult {
  hours: number
  minutes: number
}

export const getCurrentTime = (): Time => {
  const now = new Date()
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  }
}

export const angleToMinute = (angle: number): number => {
  const normalizedAngle = (angle + 360) % 360
  return Math.round(normalizedAngle / 6) % 60
}

export const angleToHourAndMinute = (
  angle: number,
  currentHours: number,
  prevHourAngle: number
): HourAngleResult => {
  const normalizedAngle = (angle + 360) % 360
  const totalMinutes = Math.round(normalizedAngle * 2) % 720
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const crossedTwelve = Math.abs(normalizedAngle - prevHourAngle) > 180
  let newHours = currentHours

  if (crossedTwelve) {
    if (prevHourAngle > 180 && normalizedAngle < 180) {
      const currentHour24 = currentHours
      if (currentHour24 === 11) newHours = 12
      else if (currentHour24 === 23) newHours = 0
      else newHours = currentHour24 + 1
    } else if (prevHourAngle < 180 && normalizedAngle > 180) {
      const currentHour24 = currentHours
      if (currentHour24 === 12) newHours = 11
      else if (currentHour24 === 0) newHours = 23
      else newHours = currentHour24 - 1
    } else {
      const isCurrentlyPM = currentHours >= 12
      newHours = isCurrentlyPM ? hours : hours + 12
    }
  } else {
    const isCurrentlyPM = currentHours >= 12
    if (isCurrentlyPM && hours < 12) {
      newHours = hours + 12
    } else if (!isCurrentlyPM && hours === 12) {
      newHours = 0
    } else if (!isCurrentlyPM && hours < 12) {
      newHours = hours
    } else {
      newHours = hours
    }
  }

  newHours = ((newHours % 24) + 24) % 24

  return { hours: newHours, minutes }
}

export const hourToAngle = (hour: number, minute: number): number => {
  const hourAngle = (hour % 12) * 30 + minute * 0.5
  return hourAngle - 90
}

export const minuteToAngle = (minute: number): number => {
  return minute * 6 - 90
}

export const secondToAngle = (second: number): number => {
  return second * 6 - 90
}

export const getAngleFromPosition = (
  clientX: number,
  clientY: number,
  clockElement: SVGSVGElement
): number => {
  const rect = clockElement.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const deltaX = clientX - centerX
  const deltaY = clientY - centerY

  const mathAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  const clockAngle = (mathAngle + 90 + 360) % 360

  return clockAngle
}

export const shouldUpdateHour = (prevMinute: number, newMinute: number): boolean => {
  return (
    (prevMinute >= 55 && newMinute <= 5) || // 右回り（59→0）
    (prevMinute <= 5 && newMinute >= 55) // 左回り（0→59）
  )
}

export const calculateNewHour = (
  currentHours: number,
  prevMinute: number,
  newMinute: number
): number => {
  let newHours = currentHours

  if (prevMinute >= 55 && newMinute <= 5) {
    // 右回り: 時間を進める
    newHours = (currentHours + 1) % 24
  } else if (prevMinute <= 5 && newMinute >= 55) {
    // 左回り: 時間を戻す
    newHours = currentHours - 1
    if (newHours < 0) newHours = 23
  }

  return newHours
}

export const getDisplayHour = (hours: number, is24HourMode: boolean): number => {
  return is24HourMode ? hours : hours % 12 === 0 ? 12 : hours % 12
}

export const isAM = (hours: number): boolean => {
  return hours < 12
}

export const formatTime = (
  hours: number,
  minutes: number,
  seconds: number,
  is24HourMode: boolean,
  showSeconds: boolean
): string => {
  const displayHour = getDisplayHour(hours, is24HourMode)
  const formattedHour = displayHour.toString().padStart(2, "0")
  const formattedMinute = minutes.toString().padStart(2, "0")
  const formattedSecond = seconds.toString().padStart(2, "0")

  return showSeconds
    ? `${formattedHour}:${formattedMinute}:${formattedSecond}`
    : `${formattedHour}:${formattedMinute}`
}

export const parseTimeString = (
  timeString: string,
  showSeconds: boolean
): { hours: number; minutes: number; seconds: number } | null => {
  const timePattern = showSeconds ? /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/ : /^(\d{1,2}):(\d{1,2})$/
  const match = timeString.match(timePattern)

  if (!match) return null

  const hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  const seconds = showSeconds ? Number.parseInt(match[3], 10) : 0

  // 有効な時間かチェック
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null
  }

  return { hours, minutes, seconds }
}

export const convertTo24Hour = (
  hours: number,
  isAMTime: boolean,
  is24HourMode: boolean
): number => {
  if (is24HourMode) return hours

  if (hours === 12 && isAMTime) {
    return 0 // 12 AM = 0時
  } else if (hours !== 12 && !isAMTime) {
    return hours + 12 // PM時間（12以外）は+12
  }

  return hours
}