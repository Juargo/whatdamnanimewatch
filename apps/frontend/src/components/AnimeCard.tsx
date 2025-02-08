// src/components/AnimeCard.tsx
import React from 'react'

interface AnimeProps {
  title: string
  image: string
  score: number
  type: string
  year: number
  status: string
}

const AnimeCard: React.FC<AnimeProps> = ({ title, image, score, type, year, status }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-sm transition-transform hover:scale-105">
      <img
        src={image as string}
        alt={title as string}
        className="rounded-lg w-full h-48 object-cover"
      />
      <div className="mt-3">
        <h3 className="text-lg font-bold text-gray-900">{title as string}</h3>
        <p className="text-sm text-gray-600">
          ⭐ {score} | {type} | {year}
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
            status === 'Finished' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

export default AnimeCard
