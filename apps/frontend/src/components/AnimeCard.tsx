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
    <div className="bg-white shadow-lg rounded-2xl p-[5px] w-full max-w-sm transition-transform hover:scale-105 flex flex-col justify-between">
      <div className="relative">
        <img src={image} alt={title} className="rounded-t-lg w-full h-48 object-cover" />
        {/* 🟢 Score en la esquina superior izquierda */}
        <div className="border-1 absolute top-2 left-2 bg-white bg-opacity-80 p-1 rounded-lg">
          <p className="text-xs font-semibold text-gray-900">⭐ {score}</p>
        </div>
        {/* 🟢 Estado en la esquina superior derecha */}
        <div
          className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white ${statusColors[status] || 'bg-gray-500'}`}
          title={status} // Tooltip con el estado
        />
        {/* 🟢 type en la esquina inferior izquierda */}
        <div className="border-1 absolute bottom-2 left-2 bg-white bg-opacity-80 p-1 rounded-lg">
          <p className="text-xs font-semibold text-gray-900">{type}</p>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        {/* 🏷 Título con altura fija */}
        <h3 className="p-1 text-[.7rem] font-semibold text-white text-center h-20 flex items-center justify-center overflow-hidden bg-[#7373d2]">
          {title}
        </h3>

        {/* 📊 Datos del anime con altura fija */}
        <p className="text-sm text-gray-600 font-bold text-center flex items-center justify-center p-1">
          {year}
        </p>
      </div>
    </div>
  )
}

export default AnimeCard
