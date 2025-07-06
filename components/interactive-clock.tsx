"use client"

import type * as React from "react"
import { useRef } from "react"
import { cn } from "../lib/utils"
import { themes, getThemeGradient, type ThemeKey } from "../lib/themes"
import { getTranslations } from "../lib/i18n"
import { hourToAngle, minuteToAngle, secondToAngle, getDisplayHour, isAM, formatTime } from "../lib/clock-utils"
import { CLOCK_DIMENSIONS } from "../lib/constants"
import { useClock } from "../hooks/useClock"
import { useClockDrag } from "../hooks/useClockDrag"
import { useClockEdit } from "../hooks/useClockEdit"
import { useMobileOptimization } from "../hooks/useMobileOptimization"
import ResponsiveContainer from "./ResponsiveContainer"
import MobileOptimizedClock from "./MobileOptimizedClock"
import MobileControlPanel from "./MobileControlPanel"

export default function InteractiveClock() {
  const clockRef = useRef<SVGSVGElement>(null)
  
  const clockState = useClock()
  const mobileOptimization = useMobileOptimization()
  const {
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
    setTime,
    setIsDragging,
    setIs24HourMode,
    setCurrentTheme,
    setShowSecondHand,
    setIsClockRunning,
    setIsEditing,
    setEditValue,
    updateTimeWithMinuteRotation,
    resetToCurrentTime,
  } = clockState

  // 現在の翻訳を取得
  const t = getTranslations(language)
  const theme = themes[currentTheme]
  const { deviceInfo, triggerHapticFeedback } = mobileOptimization

  // ドラッグハンドラーの初期化
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleTouchMove } = useClockDrag({
    isDragging,
    currentHours: time.hours,
    prevHourAngle: prevHourAngleRef.current,
    setTime,
    setIsDragging,
    setIsClockRunning,
    updateTimeWithMinuteRotation,
  })

  // 編集ハンドラーの初期化
  const { handleEditStart, handleEditComplete, handleEditKeyDown } = useClockEdit({
    time,
    is24HourMode,
    showSecondHand,
    isEditing,
    editValue,
    setTime,
    setIsEditing,
    setEditValue,
    setIsClockRunning,
  })

  // テーマ変更ハンドラー（スワイプ対応）
  const handleThemeChange = (direction: 'next' | 'prev') => {
    const themeKeys = Object.keys(themes) as ThemeKey[]
    const currentIndex = themeKeys.indexOf(currentTheme)
    let nextIndex: number
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % themeKeys.length
    } else {
      nextIndex = currentIndex === 0 ? themeKeys.length - 1 : currentIndex - 1
    }
    
    setCurrentTheme(themeKeys[nextIndex])
    triggerHapticFeedback('medium')
  }

  // タイムフォーマット切り替えハンドラー
  const handleTimeFormatToggle = () => {
    setIs24HourMode(!is24HourMode)
    triggerHapticFeedback('light')
  }

  // 角度計算の結果を取得
  const hourAngle = hourToAngle(time.hours, time.minutes)
  const minuteAngle = minuteToAngle(time.minutes)
  const secondAngle = secondToAngle(time.seconds)

  // AM/PM判定と表示用時間の計算
  const isAMTime = isAM(time.hours)
  const displayHour = getDisplayHour(time.hours, is24HourMode)

  return (
    <ResponsiveContainer className={`bg-gradient-to-br ${theme.background}`}>
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2 flex items-center justify-center gap-3 tracking-wide">
          🕐 {t.title}
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
      </div>

      {/* アナログ時計 */}
      <MobileOptimizedClock
        clockRef={clockRef}
        width={CLOCK_DIMENSIONS.WIDTH}
        height={CLOCK_DIMENSIONS.HEIGHT}
        onMouseMove={(e) => handleMouseMove(e, clockRef)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={(e) => handleTouchMove(e, clockRef)}
        onTouchStart={(e) => isDragging && e.preventDefault()}
        onTouchEnd={handleMouseUp}
        isDragging={isDragging !== null}
        onThemeChange={handleThemeChange}
        onTimeFormatToggle={handleTimeFormatToggle}
        currentTheme={currentTheme}
      >
          {/* 時計の影 */}
          <circle cx="165" cy="165" r={CLOCK_DIMENSIONS.RADIUS} fill="rgba(0,0,0,0.1)" />

          {/* 時計の外枠 */}
          <circle
            cx={CLOCK_DIMENSIONS.CENTER.x}
            cy={CLOCK_DIMENSIONS.CENTER.y}
            r={CLOCK_DIMENSIONS.RADIUS}
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="3"
          />

          {/* 時計の数字 */}
          {Array.from({ length: 12 }, (_, i) => {
            const number = i === 0 ? 12 : i
            const angle = i * 30 - 90
            const x = Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.NUMBER_RADIUS * Math.cos((angle * Math.PI) / 180)).toFixed(4))
            const y = Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.NUMBER_RADIUS * Math.sin((angle * Math.PI) / 180)).toFixed(4))

            return (
              <text
                key={number}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xl font-bold fill-gray-800"
              >
                {number}
              </text>
            )
          })}

          {/* 時間の目盛り */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30
            const x1 = Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.HOUR_MARK_OUTER * Math.cos(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const y1 = Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.HOUR_MARK_OUTER * Math.sin(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const x2 = Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.HOUR_MARK_INNER * Math.cos(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const y2 = Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.HOUR_MARK_INNER * Math.sin(((angle - 90) * Math.PI) / 180)).toFixed(4))

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="2" />
          })}

          {/* 分の目盛り */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 === 0) return null

            const angle = i * 6
            const x1 = Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.MINUTE_MARK_OUTER * Math.cos(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const y1 = Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.MINUTE_MARK_OUTER * Math.sin(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const x2 = Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.MINUTE_MARK_INNER * Math.cos(((angle - 90) * Math.PI) / 180)).toFixed(4))
            const y2 = Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.MINUTE_MARK_INNER * Math.sin(((angle - 90) * Math.PI) / 180)).toFixed(4))

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth="1" />
          })}

          {/* 分針 */}
          <line
            x1={CLOCK_DIMENSIONS.CENTER.x}
            y1={CLOCK_DIMENSIONS.CENTER.y}
            x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.cos((minuteAngle * Math.PI) / 180)).toFixed(4))}
            y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.sin((minuteAngle * Math.PI) / 180)).toFixed(4))}
            stroke={theme.minuteHand}
            strokeWidth="5"
            strokeLinecap="round"
            className={cn(
              "cursor-pointer transition-all duration-150 drop-shadow-sm",
              isDragging === "minute" ? "stroke-blue-600" : "hover:stroke-blue-600",
            )}
            onMouseDown={() => handleMouseDown("minute")}
            onTouchStart={(e) => {
              e.preventDefault()
              handleMouseDown("minute")
            }}
          />

          {/* 秒針 - showSecondHandがtrueの場合のみ表示 */}
          {showSecondHand && (
            <line
              x1={CLOCK_DIMENSIONS.CENTER.x}
              y1={CLOCK_DIMENSIONS.CENTER.y}
              x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.SECOND_HAND_LENGTH * Math.cos((secondAngle * Math.PI) / 180)).toFixed(4))}
              y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.SECOND_HAND_LENGTH * Math.sin((secondAngle * Math.PI) / 180)).toFixed(4))}
              stroke={theme.secondHand}
              strokeWidth="2"
              strokeLinecap="round"
              className="drop-shadow-sm"
              style={{ opacity: 0.8 }}
            />
          )}

          {/* 時針 */}
          <line
            x1={CLOCK_DIMENSIONS.CENTER.x}
            y1={CLOCK_DIMENSIONS.CENTER.y}
            x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.cos((hourAngle * Math.PI) / 180)).toFixed(4))}
            y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.sin((hourAngle * Math.PI) / 180)).toFixed(4))}
            stroke={theme.hourHand}
            strokeWidth="7"
            strokeLinecap="round"
            className={cn(
              "cursor-pointer transition-all duration-150 drop-shadow-sm",
              isDragging === "hour" ? "stroke-red-600" : "hover:stroke-red-600",
            )}
            onMouseDown={() => handleMouseDown("hour")}
            onTouchStart={(e) => {
              e.preventDefault()
              handleMouseDown("hour")
            }}
          />

          {/* 中心の円 */}
          <circle
            cx={CLOCK_DIMENSIONS.CENTER.x}
            cy={CLOCK_DIMENSIONS.CENTER.y}
            r={CLOCK_DIMENSIONS.CENTER_DOT_RADIUS}
            fill="#374151"
            className="drop-shadow-sm"
          />
      </MobileOptimizedClock>

      {/* デジタル表示 */}
      <div
        className={`${theme.digitalBg} backdrop-blur-md text-gray-800 rounded-2xl text-center border border-gray-200/50 shadow-lg mb-3 ${
          deviceInfo.isMobile ? 'p-3' : 'p-6'
        }`}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditComplete}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-mono mb-2 tracking-wider bg-transparent text-center outline-none border-b-2 border-gray-400 focus:border-blue-500"
            placeholder={showSecondHand ? "HH:MM:SS" : "HH:MM"}
            autoFocus
          />
        ) : (
          <div
            className={`font-light font-mono mb-2 tracking-wider cursor-pointer hover:bg-gray-100/20 rounded-lg p-2 transition-colors ${
              deviceInfo.isMobile ? 'text-2xl' : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
            }`}
            onDoubleClick={handleEditStart}
            title="ダブルクリックで編集"
          >
            {formatTime(displayHour, time.minutes, time.seconds, is24HourMode, showSecondHand)}
          </div>
        )}
        {!is24HourMode && (
          <div className={`font-light opacity-70 tracking-wide ${
            deviceInfo.isMobile ? 'text-sm' : 'text-xl sm:text-2xl md:text-3xl'
          }`}>
            {isAMTime ? "AM" : "PM"}
          </div>
        )}
        {is24HourMode && (
          <div className={`font-light opacity-70 tracking-wide ${
            deviceInfo.isMobile ? 'text-xs' : 'text-sm sm:text-lg md:text-xl'
          }`}>
            {t.twentyFourHourLabel}
          </div>
        )}
      </div>

      {/* 操作説明（モバイル以外） */}
      {!deviceInfo.isMobile && (
        <div className="text-center text-gray-700 mb-6 bg-white/60 backdrop-blur-md rounded-xl p-4 border border-gray-200/40 shadow-sm">
          <p className="mb-2 flex items-center justify-center gap-2 text-base font-light">{t.hourHandInstruction}</p>
          <p className="flex items-center justify-center gap-2 text-base font-light">{t.minuteHandInstruction}</p>
        </div>
      )}

      {/* コントロールパネル */}
      <MobileControlPanel
        language={language}
        is24HourMode={is24HourMode}
        showSecondHand={showSecondHand}
        isClockRunning={isClockRunning}
        currentTheme={currentTheme}
        onToggleTimeFormat={handleTimeFormatToggle}
        onToggleSecondHand={() => setShowSecondHand(!showSecondHand)}
        onToggleClockMovement={() => setIsClockRunning(!isClockRunning)}
        onResetTime={resetToCurrentTime}
        onThemeChange={setCurrentTheme}
      />
    </ResponsiveContainer>
  )
}