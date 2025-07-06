export interface Theme {
  name: string
  background: string
  clockFace: string
  hourHand: string
  minuteHand: string
  digitalBg: string
  buttonBg: string
  accent: string
  secondHand: string
}

export type ThemeKey = 'warm' | 'cool' | 'nature' | 'elegant' | 'cute'

export const themes: Record<ThemeKey, Theme> = {
  warm: {
    name: "ウォーム",
    background: "from-amber-50 via-orange-50 to-rose-100",
    clockFace: "white",
    hourHand: "#ef4444",
    minuteHand: "#3b82f6",
    digitalBg: "bg-white/80",
    buttonBg: "bg-white/70 hover:bg-white/90",
    accent: "#f59e0b",
    secondHand: "#f59e0b",
  },
  cool: {
    name: "クール",
    background: "from-blue-50 via-cyan-50 to-teal-100",
    clockFace: "white",
    hourHand: "#0ea5e9",
    minuteHand: "#06b6d4",
    digitalBg: "bg-blue-50/80",
    buttonBg: "bg-blue-50/70 hover:bg-blue-50/90",
    accent: "#0ea5e9",
    secondHand: "#0ea5e9",
  },
  nature: {
    name: "ナチュラル",
    background: "from-green-50 via-emerald-50 to-lime-100",
    clockFace: "white",
    hourHand: "#059669",
    minuteHand: "#10b981",
    digitalBg: "bg-green-50/80",
    buttonBg: "bg-green-50/70 hover:bg-green-50/90",
    accent: "#059669",
    secondHand: "#059669",
  },
  elegant: {
    name: "エレガント",
    background: "from-purple-50 via-violet-50 to-indigo-100",
    clockFace: "white",
    hourHand: "#7c3aed",
    minuteHand: "#8b5cf6",
    digitalBg: "bg-purple-50/80",
    buttonBg: "bg-purple-50/70 hover:bg-purple-50/90",
    accent: "#7c3aed",
    secondHand: "#7c3aed",
  },
  cute: {
    name: "キュート",
    background: "from-pink-50 via-rose-50 to-red-100",
    clockFace: "white",
    hourHand: "#ec4899",
    minuteHand: "#f472b6",
    digitalBg: "bg-pink-50/80",
    buttonBg: "bg-pink-50/70 hover:bg-pink-50/90",
    accent: "#ec4899",
    secondHand: "#ec4899",
  },
}

export const getThemeGradient = (themeKey: ThemeKey): string => {
  const gradients: Record<ThemeKey, string> = {
    warm: "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)",
    cool: "linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981)",
    nature: "linear-gradient(135deg, #059669, #10b981, #84cc16)",
    elegant: "linear-gradient(135deg, #7c3aed, #8b5cf6, #6366f1)",
    cute: "linear-gradient(135deg, #ec4899, #f472b6, #fb7185)",
  }
  return gradients[themeKey]
}