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
    <div className="franchise-list">
      {franchises.map((fr) => (
        <FranchiseCard key={fr.id} franchise={fr} onClick={() => onSelectFranchise(fr)} />
      ))}
    </div>
  )
}

export default FranchiseList
