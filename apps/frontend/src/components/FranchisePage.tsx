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

interface PaginationInfo {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

function FranchisePage() {
  const [franchises, setFranchises] = useState([])
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null)
  const [animes, setAnimes] = useState([])
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Nuevos estados para la paginación
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  })

  // 1. Al montar el componente, cargamos todas las franquicias
  useEffect(() => {
    fetchFranchises().catch((err) => console.error('Error in fetchFranchises:', err))
  }, [])

  // Función para obtener franquicias, con paginación y filtrado opcional por letra
  async function fetchFranchises(letter?: string, page = 1, limit = pagination.itemsPerPage) {
    try {
      let url = `http://localhost:3000/api/franchises?page=${page}&limit=${limit}`
      if (letter) {
        url = `http://localhost:3000/api/franchises?letra=${letter.toLowerCase()}&page=${page}&limit=${limit}`
      }

      const res = await fetch(url)
      const data = await res.json()

      setFranchises(data.data)

      // Actualiza la información de paginación
      setPagination({
        totalItems: data.total || data.data.length,
        totalPages: data.totalPages || Math.ceil((data.total || data.data.length) / limit),
        currentPage: page,
        itemsPerPage: limit,
      })
    } catch (err) {
      console.error('Error fetching franchises:', err)
    }
  }

  // Manejador para seleccionar una letra
  const handleLetterClick = async (letter: string) => {
    setSelectedLetter(letter)
    await fetchFranchises(letter, 1) // Resetea a la página 1 cuando se cambia la letra
  }

  // Manejadores para la navegación de páginas
  const handlePreviousPage = async () => {
    if (pagination.currentPage > 1) {
      await fetchFranchises(selectedLetter || undefined, pagination.currentPage - 1)
    }
  }

  const handleNextPage = async () => {
    if (pagination.currentPage < pagination.totalPages) {
      await fetchFranchises(selectedLetter || undefined, pagination.currentPage + 1)
    }
  }

  // Manejador para cambiar el número de items por página
  const handleItemsPerPageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10)
    await fetchFranchises(selectedLetter || undefined, 1, newLimit)
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

  // Componente de navegación de páginas
  const renderPagination = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          padding: '0.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
        }}
      >
        <button
          onClick={handlePreviousPage}
          disabled={pagination.currentPage <= 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: pagination.currentPage <= 1 ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Anterior
        </button>

        <span>
          Página {pagination.currentPage} de {pagination.totalPages}({pagination.totalItems}{' '}
          franquicias)
        </span>

        <div>
          <label htmlFor="itemsPerPage" style={{ marginRight: '0.5rem' }}>
            Mostrar:
          </label>
          <select
            id="itemsPerPage"
            value={pagination.itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              padding: '0.25rem',
              marginRight: '0.5rem',
              borderRadius: '4px',
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <button
          onClick={handleNextPage}
          disabled={pagination.currentPage >= pagination.totalPages}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor:
              pagination.currentPage >= pagination.totalPages ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pagination.currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Siguiente
        </button>
      </div>
    )
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
        {renderPagination()}
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
