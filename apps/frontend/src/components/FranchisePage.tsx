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
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // 1. Al montar el componente, cargamos todas las franquicias
  useEffect(() => {
    fetchFranchises().catch((err) => console.error('Error in fetchFranchises:', err))
  }, [])

  // Función para obtener franquicias, con opción de filtrar por letra
  async function fetchFranchises(letter?: string) {
    try {
      let url = 'http://localhost:3000/api/franchises?page=1&limit=100'
      if (letter) {
        url = `http://localhost:3000/api/franchises?letra=${letter.toLowerCase()}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setFranchises(data.data) // asumiendo la respuesta tiene { data: [ ... ] }
    } catch (err) {
      console.error('Error fetching franchises:', err)
    }
  }

  // Manejador para seleccionar una letra
  const handleLetterClick = async (letter: string) => {
    setSelectedLetter(letter)
    await fetchFranchises(letter)
  }

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

  // Genera los botones de letras para la columna de la izquierda
  const renderAlphabetButtons = () => {
    const letters = [
      '#',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ]

    return letters.map((letter) => (
      <button
        key={letter}
        onClick={() => handleLetterClick(letter)}
        className={`letter-button ${selectedLetter === letter ? 'selected' : ''}`}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 0',
          margin: '4px 0',
          textAlign: 'center',
          backgroundColor: selectedLetter === letter ? '#3b82f6' : '#e5e7eb',
          color: selectedLetter === letter ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: selectedLetter === letter ? 'bold' : 'normal',
        }}
      >
        {letter}
      </button>
    ))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Nueva columna con letras */}
      <div
        style={{
          flex: 0.5,
          borderRight: '1px solid #ccc',
          padding: '1rem',
          overflowY: 'auto',
          height: '100vh',
          backgroundColor: '#f3f4f6',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Filtrar</h3>
        {renderAlphabetButtons()}
      </div>

      {/* Columna con la lista de franquicias */}
      <div
        style={{
          flex: 2,
          borderRight: '1px solid #ccc',
          padding: '1rem',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <h2>Franquicias {selectedLetter ? `- ${selectedLetter}` : ''}</h2>
        <FranchiseList franchises={franchises} onSelectFranchise={handleSelectFranchise} />
      </div>

      {/* Columna con los animes de la franquicia seleccionada */}
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
