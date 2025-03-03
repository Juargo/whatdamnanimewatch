// src/components/AnimeList.tsx
import React, { useEffect, useState } from 'react'
import AnimeCard from './AnimeCard'

interface Anime {
  id: string
  title: string
  image: string
  score: number
  type: string
  year: number
  status: string
}

interface AnimeListProps {
  animes: Anime[]
}

const AnimeList: React.FC<AnimeListProps> = ({ animes }) => {
  // const [animes, setAnimes] = useState<Anime[]>([])
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchAnimes = async () => {
  //     console.log('Fetching animes...')
  //     try {
  //       const response = await fetch('http://localhost:3000/api/animes?page=1&limit=2000')
  //       const data = await response.json()
  //       console.log('Animes obtenidos:', data)
  //       setAnimes(data)
  //       console.log('Estado después de setAnimes:', animes) // Verificar si cambia
  //     } catch (error) {
  //       console.error('Error fetching animes:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchAnimes()
  // }, [])

  // useEffect(() => {
  //   console.log('Animes actualizados:', animes)
  // }, [animes])

  // if (loading) return <p className="text-center text-gray-500">Cargando animes...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 p-4">
      {animes?.length > 0 ? (
        animes
          .filter((anime) => anime.status !== 'Not yet aired')
          .map((anime) => <AnimeCard key={anime.mal_id} {...anime} />)
      ) : (
        <p>No se encontraron animes.</p>
      )}
    </div>
  )
}

export default AnimeList
