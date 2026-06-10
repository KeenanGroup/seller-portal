'use client'

import { useState } from 'react'

interface PropertyHeroProps {
  images: string[]
  address: string
  neighborhood?: string
  status?: string
}

export function PropertyHero({ images, address, neighborhood, status }: PropertyHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const hasMultiple = images.length > 1

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`${address} - Photo ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold drop-shadow-lg">
              {address}
            </h1>
            {neighborhood && (
              <p className="text-white/80 mt-1 drop-shadow">{neighborhood}</p>
            )}
          </div>
          {status && (
            <span className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
              status === 'active'
                ? 'bg-green-500/80 text-white'
                : 'bg-yellow-500/80 text-white'
            }`}>
              {status.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {hasMultiple && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Previous photo"
          >
            <svg className="w-5 h-5 text-black/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Next photo"
          >
            <svg className="w-5 h-5 text-black/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
