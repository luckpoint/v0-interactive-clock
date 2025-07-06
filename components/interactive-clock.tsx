"use client"

import type * as React from "react"
import { useRef, useState, useEffect } from "react"
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
import HelpOverlay from "./HelpOverlay"

export default function InteractiveClock() {
  const clockRef = useRef<SVGSVGElement>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  
  // ダブルタップ検出のための状態
  const [lastTapTime, setLastTapTime] = useState<number>(0)
  const [tapCount, setTapCount] = useState<number>(0)
  
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

  // カスタムダブルタップ検出ハンドラー
  const handleDigitalClockTap = () => {
    const currentTime = Date.now()
    const timeSinceLastTap = currentTime - lastTapTime
    
    if (timeSinceLastTap < 300 && tapCount === 1) {
      // ダブルタップが検出された
      setTapCount(0)
      setLastTapTime(0)
      handleEditStart()
      triggerHapticFeedback('medium')
    } else {
      // 最初のタップ
      setTapCount(1)
      setLastTapTime(currentTime)
      
      // 300ms後にタップカウントをリセット
      setTimeout(() => {
        setTapCount(0)
        setLastTapTime(0)
      }, 300)
    }
  }

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

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    if (!isThemeDropdownOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.theme-dropdown')) {
        console.log('Outside click detected, closing dropdown')
        setIsThemeDropdownOpen(false)
      }
    }

    // 少し遅延を設けて、ボタンクリックと外部クリックの競合を防ぐ
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isThemeDropdownOpen])

  // デバッグ用：状態の変化を追跡
  useEffect(() => {
    console.log('isThemeDropdownOpen changed:', isThemeDropdownOpen)
  }, [isThemeDropdownOpen])

  return (
    <ResponsiveContainer className={`bg-gradient-to-br ${theme.background} relative`}>
      {/* 右上の固定位置要素 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
        {/* ヘルプボタン */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm hover:bg-white/90 transition-colors"
          aria-label={t.help}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        </button>
        
        {/* カスタムテーマドロップダウン */}
        <div className="relative theme-dropdown">
          <button
            onClick={(e) => {
              e.stopPropagation()
              console.log('Theme dropdown clicked, current state:', isThemeDropdownOpen)
              setIsThemeDropdownOpen(!isThemeDropdownOpen)
            }}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm px-3 py-2 text-sm hover:bg-white/90 transition-colors cursor-pointer"
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{
                background: getThemeGradient(currentTheme),
              }}
            />
            <svg
              className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isThemeDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg z-50 p-2">
              <div className="flex flex-col gap-1">
                {Object.entries(themes).map(([key, themeData]) => (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentTheme(key as ThemeKey)
                      setIsThemeDropdownOpen(false)
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/50 transition-colors ${
                      currentTheme === key ? 'bg-gray-100/50' : ''
                    }`}
                    title={themeData.name}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        currentTheme === key ? 'border-gray-700' : 'border-gray-300'
                      }`}
                      style={{
                        background: getThemeGradient(key as ThemeKey),
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8 text-left self-start w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2 flex items-center gap-3 tracking-wide text-left">
          🕐 {t.title}
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
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
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`font-light font-mono tracking-wider cursor-pointer hover:bg-gray-100/20 rounded-lg p-2 transition-colors select-none ${
                deviceInfo.isMobile ? 'text-2xl' : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
              }`}
              onDoubleClick={handleEditStart}
              onClick={deviceInfo.isMobile ? handleDigitalClockTap : undefined}
              onTouchStart={deviceInfo.isMobile ? (e) => e.preventDefault() : undefined}
              title={deviceInfo.isMobile ? "ダブルタップで編集" : "ダブルクリックで編集"}
            >
              {formatTime(displayHour, time.minutes, time.seconds, is24HourMode, showSecondHand)}
            </div>
            {!is24HourMode && (
              <div className={`font-light opacity-70 tracking-wide ${
                deviceInfo.isMobile ? 'text-sm' : 'text-xl sm:text-2xl md:text-3xl'
              }`}>
                {isAMTime ? "AM" : "PM"}
              </div>
            )}
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
        onToggleTimeFormat={handleTimeFormatToggle}
        onToggleSecondHand={() => setShowSecondHand(!showSecondHand)}
        onToggleClockMovement={() => setIsClockRunning(!isClockRunning)}
        onResetTime={resetToCurrentTime}
      />
      
      {/* ヘルプオーバーレイ */}
      <HelpOverlay
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />
    </ResponsiveContainer>
  )
}