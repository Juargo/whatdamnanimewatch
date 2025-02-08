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
  // Define colores según el estado del anime
  const statusColors = {
    'Finished Airing': 'bg-blue-500', // Verde para terminados
    'Currently Airing': 'bg-green-500', // Amarillo para en emisión
    'Not yet aired': 'bg-gray-500', // Gris para no emitidos
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-[5px] w-full max-w-sm transition-transform hover:scale-105 flex flex-col justify-between min-h-[350px]">
      <div className="relative">
        <img src={image} alt={title} className="rounded-lg w-full h-48 object-cover" />
        {/* 🟢 Estado en la esquina superior derecha */}
        <div
          className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white ${statusColors[status] || 'bg-gray-500'}`}
          title={status} // Tooltip con el estado
        />
      </div>

      <div className="mt-3 flex flex-col flex-grow justify-between">
        {/* 🏷 Título con altura fija */}
        <h3 className="text-xs font-bold text-gray-900 text-center h-14 flex items-center justify-center overflow-hidden">
          {title}
        </h3>

        {/* 📊 Datos del anime con altura fija */}
        <p className="text-sm text-gray-600 text-center h-8 flex items-center justify-center">
          ⭐ {score} | {type} | {year}
        </p>

        {/* 🟢 Estado con margen superior automático */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-center mx-auto h-10 flex items-center justify-center ${
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
