import React from 'react'

interface Franchise {
  nombre: string
  imagen?: string
  cantidadAnimes: number
}
interface FranchiseCardProps {
  franchise: Franchise
  onClick: () => void
  className?: string
}

function FranchiseCard({ franchise, onClick, className }: FranchiseCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${className}`} // ✅ Aplicar className aquí
      onClick={onClick}
    >
      <img
        src={franchise.imagen}
        alt={franchise.nombre}
        className="w-full h-32 object-cover rounded-md"
      />
      <h3 className="text-lg font-bold mt-2">{franchise.nombre}</h3>
      <p className="text-sm text-gray-500">{franchise.cantidadAnimes} animes</p>
    </div>
  )
}

export default FranchiseCard
