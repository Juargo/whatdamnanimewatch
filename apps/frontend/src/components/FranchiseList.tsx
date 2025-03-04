import React from 'react'
import FranchiseCard from './FranchiseCard'

interface Franchise {
  id: number
  nombre: string
  imagen: string
  cantidadAnimes: number
}

interface FranchiseListProps {
  franchises: Franchise[]
  onSelectFranchise: (franchise: Franchise) => void
}

function FranchiseList({ franchises, onSelectFranchise }: FranchiseListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {franchises.map((fr) => (
        <FranchiseCard
          key={fr.id}
          franchise={fr}
          onClick={() => onSelectFranchise(fr)}
          className="cursor-pointer transition-transform transform hover:scale-105"
        />
      ))}
    </div>
  )
}

export default FranchiseList
