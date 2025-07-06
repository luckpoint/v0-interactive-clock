import React from 'react'
import { getTranslations, type Language } from '../lib/i18n'

interface HelpOverlayProps {
  isOpen: boolean
  onClose: () => void
  language: Language
}

export default function HelpOverlay({ isOpen, onClose, language }: HelpOverlayProps) {
  const t = getTranslations(language)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{t.helpTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              aria-label={t.close}
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-base">{t.helpContent.basic}</p>
            
            <div className="space-y-2">
              <p className="text-sm">{t.helpContent.dragHands}</p>
              <p className="text-sm">{t.helpContent.editTime}</p>
              <p className="text-sm">{t.helpContent.controls}</p>
              <p className="text-sm">{t.helpContent.themes}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 