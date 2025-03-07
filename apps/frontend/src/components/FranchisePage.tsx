/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react'
import FranchiseList from './FranchiseList'
import AnimeList from './AnimeList'

interface Franchise {
  id: number
  nombre: string
  imagen: string
  cantidadAnimes: number
}

function FranchisePage() {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null)
  const [animes, setAnimes] = useState([])

  // 1. Al montar el componente, cargamos todas las franquicias
  useEffect(() => {
    async function fetchFranchises() {
      try {
        const res = await fetch('http://localhost:3000/api/franchises?page=1&limit=100')
        // o la ruta que uses
        const data = await res.json()
        setFranchises(data.data) // asumiendo la respuesta tiene { data: [ ... ] }
      } catch (err) {
        console.error('Error fetching franchises:', err)
      }
    }
    fetchFranchises().catch((err) => console.error('Error in fetchFranchises:', err))
  }, [])

  // 2. Manejo de selección de franquicia
  const handleSelectFranchise = async (franchise: Franchise | null) => {
    setSelectedFranchise(franchise)
    try {
      if (franchise) {
        const res = await fetch(
          `http://localhost:3000/api/allAnimesFranchiesById?id_franquicia=${franchise.id}`
        )
        const data = await res.json()
        setAnimes(data) // asumiendo { ... } es un array de animes
      }
    } catch (err) {
      console.error('Error fetching animes by franchise:', err)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Columna grande con la lista de franquicias */}
      <div
        style={{
          flex: 2,
          borderRight: '1px solid #ccc',
          padding: '1rem',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <h2>Franquicias</h2>
        <FranchiseList franchises={franchises} onSelectFranchise={handleSelectFranchise} />
      </div>

      {/* Columna más pequeña con los animes de la franquicia seleccionada */}
      <div
        style={{
          flex: 1,
          padding: '1rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <h2>
          {selectedFranchise
            ? `Animes de ${selectedFranchise.nombre}`
            : 'Selecciona una franquicia'}
        </h2>
        <AnimeList animes={animes} />
      </div>
    </div>
  )
}

export default FranchisePage
