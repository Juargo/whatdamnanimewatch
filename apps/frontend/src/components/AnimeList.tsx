// src/components/AnimeList.tsx
import React from 'react'
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
