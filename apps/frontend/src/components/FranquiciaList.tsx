/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/components/AnimeList.tsx
import React, { useEffect, useState } from 'react'
import FranquiciaCard from './FranquiciaCard'

interface Franquicia {
  id: string
  nombre: string
  imagen: string
  cantidadAnimes: number
}

const FranquiciaList: React.FC = () => {
  const [franquicia, setFranquicia] = useState<Franquicia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFranquicia = async () => {
      console.log('Fetching franquicia...')
      try {
        const response = await fetch('http://localhost:3000/api/franchises?page=1&limit=2000')
        const data = await response.json()
        console.log('Franquicia obtenidos:', data)
        setFranquicia(data)
        console.log('Estado después de setFranquicia:', franquicia) // Verificar si cambia
      } catch (error) {
        console.error('Error fetching franquicia:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFranquicia()
  }, [])

  useEffect(() => {
    console.log('Franquicia actualizados:', franquicia)
  }, [franquicia])

  if (loading) return <p className="text-center text-gray-500">Cargando franquicia...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3 p-4">
      {franquicia?.data?.length > 0 ? (
        franquicia.data.map((franquicia) => <FranquiciaCard key={franquicia.id} {...franquicia} />)
      ) : (
        <p>No se encontraron franquicia.</p>
      )}
    </div>
  )
}

export default FranquiciaList
