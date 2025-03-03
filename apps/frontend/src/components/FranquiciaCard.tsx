// src/components/FranquiciaCard.tsx
import React from 'react'

interface FranquiciaProps {
  nombre: string
  imagen: string
  cantidadAnimes: number
}

const FranquiciaCard: React.FC<FranquiciaProps> = ({ nombre, imagen, cantidadAnimes }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-[5px] w-full max-w-sm transition-transform hover:scale-105 flex flex-col justify-between">
      <div className="relative">
        <img src={imagen} alt={nombre} className="rounded-t-lg w-full h-48 object-cover" />
        {/* 🟢 Score en la esquina superior izquierda */}
        <div className="border-1 absolute top-2 left-2 bg-white bg-opacity-80 p-1 rounded-lg">
          <p className="text-xs font-semibold text-gray-900">{cantidadAnimes}</p>
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        {/* 🏷 Título con altura fija */}
        <h3 className="p-1 text-[.7rem] font-semibold text-white text-center h-20 flex items-center justify-center overflow-hidden bg-[#7373d2]">
          {nombre}
        </h3>
      </div>
    </div>
  )
}

export default FranquiciaCard
