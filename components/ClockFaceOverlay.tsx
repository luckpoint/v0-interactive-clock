import React from 'react'
import { CLOCK_FACES, type ClockFaceKey } from '../lib/clock-faces'

interface ClockFaceOverlayProps {
  isOpen: boolean
  onClose: () => void
  currentFace: ClockFaceKey | 'none'
  onSelect: (key: ClockFaceKey | 'none') => void
}

export default function ClockFaceOverlay({ isOpen, onClose, currentFace, onSelect }: ClockFaceOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Clock Faces</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(CLOCK_FACES).map(([key, face]) => {
              const selected = currentFace === key
              return (
                <button
                  key={key}
                  onClick={() => onSelect(key as ClockFaceKey)}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300 transition-colors`}
                >
                  <img
                    src={face.src}
                    alt={`${face.label} clock face`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <span className="mt-2 text-sm text-gray-700">({face.label})</span>
                </button>
              )
            })}
            {/* None option */}
            <button
              onClick={() => onSelect('none')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 ${currentFace === 'none' ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300 transition-colors`}
            >
              <span className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-lg">×</span>
              <span className="mt-2 text-sm text-gray-700">(なし)</span>
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 