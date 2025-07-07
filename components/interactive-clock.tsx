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
import sunClockFace from "../public/sun-clock-face.png"

export default function InteractiveClock() {
  const clockRef = useRef<SVGSVGElement>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)
  const [clockFace, setClockFace] = useState<'sun' | 'none'>('sun')
  const [isClockFaceDropdownOpen, setIsClockFaceDropdownOpen] = useState(false)
  
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
  const { deviceInfo, triggerHapticFeedback, isClient } = mobileOptimization

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

  // 時計盤ドロップダウンの外部クリック検出
  useEffect(() => {
    if (!isClockFaceDropdownOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.face-dropdown')) {
        setIsClockFaceDropdownOpen(false)
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isClockFaceDropdownOpen])

  return (
    <ResponsiveContainer className={`bg-gradient-to-br ${theme.background} relative`}>
      {/* ヘッダー部分 */}
      <div className="w-full mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between w-full">
          {/* 左側：ロゴとタイトル */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 flex items-center gap-3 tracking-wide">
              🕐 {t.title}
            </h1>
          </div>
          
          {/* 右側：時計盤・テーマ選択・ヘルプ */}
          <div className="flex items-center gap-2 z-40">
            
            {/* 時計盤ドロップダウン */}
            <div className="relative face-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsClockFaceDropdownOpen(!isClockFaceDropdownOpen)
                }}
                className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm hover:bg-white/90 transition-colors cursor-pointer ${
                  isClient && deviceInfo.isTablet ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'
                }`}
                aria-label="Clock face selection"
              >
                {clockFace === 'sun' ? (
                  <img
                    src={sunClockFace.src}
                    alt="sun clock face thumbnail"
                    className={`${isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'} rounded-full border border-gray-300 object-cover`}
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-700">なし</span>
                )}
                <svg
                  className={`transition-transform ${isClockFaceDropdownOpen ? 'rotate-180' : ''} ${
                    isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isClockFaceDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg z-50 p-2">
                  <div className="flex flex-col gap-1">
                    {/* Sun face option */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setClockFace('sun')
                        setIsClockFaceDropdownOpen(false)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/50 transition-colors ${
                        clockFace === 'sun' ? 'bg-gray-100/50' : ''
                      }`}
                    >
                      <img
                        src={sunClockFace.src}
                        alt="sun clock face thumbnail"
                        className={`${isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'} rounded-full border border-gray-300 object-cover`}
                      />
                    </button>
                    {/* None option */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setClockFace('none')
                        setIsClockFaceDropdownOpen(false)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100/50 transition-colors ${
                        clockFace === 'none' ? 'bg-gray-100/50' : ''
                      }`}
                    >
                      <span className="text-sm font-medium">なし</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* カスタムテーマドロップダウン */}
            <div className="relative theme-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Theme dropdown clicked, current state:', isThemeDropdownOpen)
                  setIsThemeDropdownOpen(!isThemeDropdownOpen)
                }}
                className={`flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm hover:bg-white/90 transition-colors cursor-pointer ${
                  isClient && deviceInfo.isTablet ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'
                }`}
              >
                <div
                  className={`rounded-full border border-gray-300 ${
                    isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'
                  }`}
                  style={{
                    background: getThemeGradient(currentTheme),
                  }}
                />
                <svg
                  className={`transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''} ${
                    isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'
                  }`}
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
                          className={`rounded-full border-2 ${
                            currentTheme === key ? 'border-gray-700' : 'border-gray-300'
                          } ${
                            isClient && deviceInfo.isTablet ? 'w-5 h-5' : 'w-4 h-4'
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
            
            {/* ヘルプボタン */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className={`bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm hover:bg-white/90 transition-colors ${
                isClient && deviceInfo.isTablet ? 'p-3' : 'p-2'
              }`}
              aria-label={t.help}
            >
              <svg 
                width={isClient && deviceInfo.isTablet ? "24" : "20"} 
                height={isClient && deviceInfo.isTablet ? "24" : "20"} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M8.5 8.5a3.5 3.5 0 0 1 7 1c0 2.5-3.5 3.5-3.5 3.5"/>
                <circle cx="12" cy="17" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* 装飾ライン */}
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-2"></div>
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
        onTouchCancel={handleMouseUp}
        isDragging={isDragging}
        onThemeChange={handleThemeChange}
        onTimeFormatToggle={handleTimeFormatToggle}
        currentTheme={currentTheme}
      >
          {/* パターン定義：時計盤の背景画像 */}
          <defs>
            <pattern
              id="clock-face-pattern"
              patternUnits="userSpaceOnUse"
              width={CLOCK_DIMENSIONS.RADIUS * 2}
              height={CLOCK_DIMENSIONS.RADIUS * 2}
              x={CLOCK_DIMENSIONS.CENTER.x - CLOCK_DIMENSIONS.RADIUS}
              y={CLOCK_DIMENSIONS.CENTER.y - CLOCK_DIMENSIONS.RADIUS}
            >
              <image
                href={sunClockFace.src}
                x="0"
                y="0"
                width={CLOCK_DIMENSIONS.RADIUS * 2}
                height={CLOCK_DIMENSIONS.RADIUS * 2}
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          </defs>
          {/* 時計の影 */}
          <circle cx="165" cy="165" r={CLOCK_DIMENSIONS.RADIUS} fill="rgba(0,0,0,0.1)" />

          {/* 時計の外枠 */}
          <circle
            cx={CLOCK_DIMENSIONS.CENTER.x}
            cy={CLOCK_DIMENSIONS.CENTER.y}
            r={CLOCK_DIMENSIONS.RADIUS}
            fill={clockFace === 'sun' ? 'url(#clock-face-pattern)' : theme.clockFace}
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
          <g>
            {/* 分針の透明なタッチ領域（モバイル用） */}
            {isClient && deviceInfo.isMobile && (
              <line
                x1={CLOCK_DIMENSIONS.CENTER.x}
                y1={CLOCK_DIMENSIONS.CENTER.y}
                x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.cos((minuteAngle * Math.PI) / 180)).toFixed(4))}
                y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.sin((minuteAngle * Math.PI) / 180)).toFixed(4))}
                stroke="transparent"
                strokeWidth="20"
                strokeLinecap="round"
                className="cursor-pointer"
                onMouseDown={() => handleMouseDown("minute")}
                onTouchStart={(e) => {
                  e.preventDefault()
                  triggerHapticFeedback('medium')
                  handleMouseDown("minute")
                }}
              />
            )}
            {/* 分針の見た目 */}
            <line
              x1={CLOCK_DIMENSIONS.CENTER.x}
              y1={CLOCK_DIMENSIONS.CENTER.y}
              x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.cos((minuteAngle * Math.PI) / 180)).toFixed(4))}
              y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.MINUTE_HAND_LENGTH * Math.sin((minuteAngle * Math.PI) / 180)).toFixed(4))}
              stroke={theme.minuteHand}
              strokeWidth={isClient && deviceInfo.isMobile ? "7" : "5"}
              strokeLinecap="round"
              className={cn(
                "cursor-pointer transition-all duration-150 drop-shadow-sm",
                isDragging === "minute" ? "stroke-blue-600" : "hover:stroke-blue-600",
              )}
              onMouseDown={() => handleMouseDown("minute")}
              onTouchStart={(e) => {
                e.preventDefault()
                triggerHapticFeedback('medium')
                handleMouseDown("minute")
              }}
            />
          </g>

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
          <g>
            {/* 時針の透明なタッチ領域（モバイル用） */}
            {isClient && deviceInfo.isMobile && (
              <line
                x1={CLOCK_DIMENSIONS.CENTER.x}
                y1={CLOCK_DIMENSIONS.CENTER.y}
                x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.cos((hourAngle * Math.PI) / 180)).toFixed(4))}
                y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.sin((hourAngle * Math.PI) / 180)).toFixed(4))}
                stroke="transparent"
                strokeWidth="22"
                strokeLinecap="round"
                className="cursor-pointer"
                onMouseDown={() => handleMouseDown("hour")}
                onTouchStart={(e) => {
                  e.preventDefault()
                  triggerHapticFeedback('medium')
                  handleMouseDown("hour")
                }}
              />
            )}
            {/* 時針の見た目 */}
            <line
              x1={CLOCK_DIMENSIONS.CENTER.x}
              y1={CLOCK_DIMENSIONS.CENTER.y}
              x2={Number((CLOCK_DIMENSIONS.CENTER.x + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.cos((hourAngle * Math.PI) / 180)).toFixed(4))}
              y2={Number((CLOCK_DIMENSIONS.CENTER.y + CLOCK_DIMENSIONS.HOUR_HAND_LENGTH * Math.sin((hourAngle * Math.PI) / 180)).toFixed(4))}
              stroke={theme.hourHand}
              strokeWidth={isClient && deviceInfo.isMobile ? "9" : "7"}
              strokeLinecap="round"
              className={cn(
                "cursor-pointer transition-all duration-150 drop-shadow-sm",
                isDragging === "hour" ? "stroke-red-600" : "hover:stroke-red-600",
              )}
              onMouseDown={() => handleMouseDown("hour")}
              onTouchStart={(e) => {
                e.preventDefault()
                triggerHapticFeedback('medium')
                handleMouseDown("hour")
              }}
            />
          </g>

          {/* 中心の円 */}
          <g>
            {/* 中心の円の透明なタッチ領域（モバイル用） */}
            {isClient && deviceInfo.isMobile && (
              <circle
                cx={CLOCK_DIMENSIONS.CENTER.x}
                cy={CLOCK_DIMENSIONS.CENTER.y}
                r={25}
                fill="transparent"
                className="cursor-pointer"
                onDoubleClick={resetToCurrentTime}
                onTouchStart={(e) => {
                  e.preventDefault()
                  triggerHapticFeedback('medium')
                }}
              />
            )}
            {/* 中心の円の見た目 */}
            <circle
              cx={CLOCK_DIMENSIONS.CENTER.x}
              cy={CLOCK_DIMENSIONS.CENTER.y}
              r={isClient && deviceInfo.isMobile ? CLOCK_DIMENSIONS.CENTER_DOT_RADIUS + 2 : CLOCK_DIMENSIONS.CENTER_DOT_RADIUS}
              fill="#374151"
              className="drop-shadow-sm cursor-pointer"
              onDoubleClick={resetToCurrentTime}
              onTouchStart={(e) => {
                if (isClient && deviceInfo.isMobile) {
                  e.preventDefault()
                  triggerHapticFeedback('medium')
                }
              }}
            />
          </g>
      </MobileOptimizedClock>

      {/* デジタル表示 */}
      <div
        className={`${theme.digitalBg} backdrop-blur-md text-gray-800 rounded-2xl text-center border border-gray-200/50 shadow-lg mb-3 ${
          isClient && deviceInfo.isMobile ? 'p-3' : 'p-6'
        }`}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditComplete}
            className={`font-light font-mono mb-2 tracking-wider bg-transparent text-center outline-none border-b-2 border-gray-400 focus:border-blue-500 ${
              isClient && deviceInfo.isTablet ? 'text-4xl sm:text-5xl' : 
              'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
            }`}
            placeholder={showSecondHand ? "HH:MM:SS" : "HH:MM"}
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`font-light font-mono tracking-wider cursor-pointer hover:bg-gray-100/20 rounded-lg p-2 transition-colors select-none ${
                isClient && deviceInfo.isMobile ? 'text-2xl' : 
                isClient && deviceInfo.isTablet ? 'text-4xl sm:text-5xl' : 
                'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
              }`}
              onDoubleClick={handleEditStart}
              onClick={isClient && deviceInfo.isMobile ? handleDigitalClockTap : undefined}
              onTouchStart={isClient && deviceInfo.isMobile ? (e) => e.preventDefault() : undefined}
              title={isClient && deviceInfo.isMobile ? "ダブルタップで編集" : "ダブルクリックで編集"}
            >
              {formatTime(displayHour, time.minutes, time.seconds, is24HourMode, showSecondHand)}
            </div>
            {!is24HourMode && (
              <div className={`font-light opacity-70 tracking-wide ${
                isClient && deviceInfo.isMobile ? 'text-sm' : 
                isClient && deviceInfo.isTablet ? 'text-lg sm:text-xl' : 
                'text-xl sm:text-2xl md:text-3xl'
              }`}>
                {isAMTime ? "AM" : "PM"}
              </div>
            )}
          </div>
        )}
      </div>

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