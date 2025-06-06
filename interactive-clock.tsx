"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface Time {
  hours: number // 0-23の24時間形式
  minutes: number // 0-59
}

interface Position {
  x: number
  y: number
}

export default function InteractiveClock() {
  const [time, setTime] = useState<Time>({ hours: 10, minutes: 10 })
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null)
  const clockRef = useRef<SVGSVGElement>(null)

  // 角度から時間への変換
  const angleToHour = (angle: number): number => {
    // 12時の位置を0度として、時計回りに計算
    const normalizedAngle = (angle + 360) % 360
    const hour = Math.round(normalizedAngle / 30) % 12
    return hour === 0 ? 12 : hour
  }

  const angleToMinute = (angle: number): number => {
    // 12時の位置を0度として、時計回りに計算
    const normalizedAngle = (angle + 360) % 360
    return Math.round(normalizedAngle / 6) % 60
  }

  // 時間から角度への変換
  const hourToAngle = (hour: number, minute: number): number => {
    const hourAngle = (hour % 12) * 30 + minute * 0.5
    return hourAngle - 90 // SVGの座標系に合わせて調整
  }

  const minuteToAngle = (minute: number): number => {
    return minute * 6 - 90 // SVGの座標系に合わせて調整
  }

  // マウス位置から角度を計算
  const getAngleFromPosition = (clientX: number, clientY: number): number => {
    if (!clockRef.current) return 0

    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = clientX - centerX
    const deltaY = clientY - centerY

    return Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  }

  // ドラッグ開始
  const handleMouseDown = useCallback((hand: "hour" | "minute") => {
    setIsDragging(hand)
  }, [])

  // ドラッグ中
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const angle = getAngleFromPosition(e.clientX, e.clientY)

      if (isDragging === "hour") {
        const newHour = angleToHour(angle)
        const currentHour = time.hours % 12 === 0 ? 12 : time.hours % 12
        const hourDiff = newHour - currentHour

        let newHours = time.hours
        if (Math.abs(hourDiff) <= 6) {
          newHours = time.hours >= 12 ? newHour + 12 : newHour
          if (newHours === 24) newHours = 12
          if (newHours === 0) newHours = 12
        }

        setTime((prev) => ({ ...prev, hours: newHours }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        setTime((prev) => ({ ...prev, minutes: newMinute }))
      }
    },
    [isDragging, time.hours],
  )

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  // タッチイベント対応
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return

      const touch = e.touches[0]
      const angle = getAngleFromPosition(touch.clientX, touch.clientY)

      if (isDragging === "hour") {
        const newHour = angleToHour(angle)
        const currentHour = time.hours % 12 === 0 ? 12 : time.hours % 12
        const hourDiff = newHour - currentHour

        let newHours = time.hours
        if (Math.abs(hourDiff) <= 6) {
          newHours = time.hours >= 12 ? newHour + 12 : newHour
          if (newHours === 24) newHours = 12
          if (newHours === 0) newHours = 12
        }

        setTime((prev) => ({ ...prev, hours: newHours }))
      } else if (isDragging === "minute") {
        const newMinute = angleToMinute(angle)
        setTime((prev) => ({ ...prev, minutes: newMinute }))
      }
    },
    [isDragging, time.hours],
  )

  const hourAngle = hourToAngle(time.hours, time.minutes)
  const minuteAngle = minuteToAngle(time.minutes)

  // AM/PM判定
  const isAM = time.hours < 12
  const displayHour = time.hours % 12 === 0 ? 12 : time.hours % 12

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">🕐 インタラクティブ時計</h1>

        {/* アナログ時計 */}
        <div className="relative mb-6">
          <svg
            ref={clockRef}
            width="280"
            height="280"
            viewBox="0 0 280 280"
            className="mx-auto cursor-pointer select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* 時計の外枠 */}
            <circle cx="140" cy="140" r="135" fill="white" stroke="#e5e7eb" strokeWidth="4" />

            {/* 時計の数字 */}
            {Array.from({ length: 12 }, (_, i) => {
              const number = i + 1
              const angle = i * 30 - 90
              const x = 140 + 110 * Math.cos((angle * Math.PI) / 180)
              const y = 140 + 110 * Math.sin((angle * Math.PI) / 180)

              return (
                <text
                  key={number}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-lg font-bold fill-gray-700"
                >
                  {number}
                </text>
              )
            })}

            {/* 時間の目盛り */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = i * 30
              const x1 = 140 + 125 * Math.cos(((angle - 90) * Math.PI) / 180)
              const y1 = 140 + 125 * Math.sin(((angle - 90) * Math.PI) / 180)
              const x2 = 140 + 115 * Math.cos(((angle - 90) * Math.PI) / 180)
              const y2 = 140 + 115 * Math.sin(((angle - 90) * Math.PI) / 180)

              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="2" />
            })}

            {/* 分の目盛り */}
            {Array.from({ length: 60 }, (_, i) => {
              if (i % 5 === 0) return null // 時間の目盛りと重複を避ける

              const angle = i * 6
              const x1 = 140 + 125 * Math.cos(((angle - 90) * Math.PI) / 180)
              const y1 = 140 + 125 * Math.sin(((angle - 90) * Math.PI) / 180)
              const x2 = 140 + 120 * Math.cos(((angle - 90) * Math.PI) / 180)
              const y2 = 140 + 120 * Math.sin(((angle - 90) * Math.PI) / 180)

              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth="1" />
            })}

            {/* 分針 */}
            <line
              x1="140"
              y1="140"
              x2={140 + 100 * Math.cos((minuteAngle * Math.PI) / 180)}
              y2={140 + 100 * Math.sin((minuteAngle * Math.PI) / 180)}
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              className={cn(
                "cursor-pointer transition-all duration-150",
                isDragging === "minute" ? "stroke-blue-600" : "hover:stroke-blue-600",
              )}
              onMouseDown={() => handleMouseDown("minute")}
              onTouchStart={() => handleMouseDown("minute")}
            />

            {/* 時針 */}
            <line
              x1="140"
              y1="140"
              x2={140 + 70 * Math.cos((hourAngle * Math.PI) / 180)}
              y2={140 + 70 * Math.sin((hourAngle * Math.PI) / 180)}
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
              className={cn(
                "cursor-pointer transition-all duration-150",
                isDragging === "hour" ? "stroke-red-600" : "hover:stroke-red-600",
              )}
              onMouseDown={() => handleMouseDown("hour")}
              onTouchStart={() => handleMouseDown("hour")}
            />

            {/* 中心の円 */}
            <circle cx="140" cy="140" r="8" fill="#374151" />
          </svg>
        </div>

        {/* デジタル表示 */}
        <div className="bg-gray-900 text-white rounded-xl p-4 text-center">
          <div className="text-3xl font-mono font-bold mb-2">
            {displayHour.toString().padStart(2, "0")}:{time.minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-lg font-semibold">{isAM ? "AM" : "PM"}</div>
        </div>

        {/* 操作説明 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">🔴 赤い針（時針）をドラッグして時間を設定</p>
          <p>🔵 青い針（分針）をドラッグして分を設定</p>
        </div>

        {/* リセットボタン */}
        <button
          onClick={() => {
            const now = new Date()
            setTime({
              hours: now.getHours(),
              minutes: now.getMinutes(),
            })
          }}
          className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          現在時刻にリセット
        </button>
      </div>
    </div>
  )
}
