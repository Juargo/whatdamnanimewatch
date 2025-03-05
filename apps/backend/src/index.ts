/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Fastify from 'fastify'
import cors, { FastifyCorsOptions } from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = Fastify()
const prisma = new PrismaClient()

// Definir correctamente las opciones de CORS
const corsOptions: FastifyCorsOptions = {
  origin: '*',
}

app.register(cors, corsOptions)

// ========================================
// Ruta para obtener franquicias con paginación y conteo de animes
// ========================================
// ========================================
// Ruta para obtener franquicias con paginación y conteo de animes
// ========================================
app.get('/api/franchises', async (request, reply) => {
  try {
    // Leer "page" y "limit" de la query
    const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number }

    const skip = (Number(page) - 1) * Number(limit)

    // Contar cuántas franquicias hay en total (para paginación)
    const totalFranchises = await prisma.franquicia.count()

    // Obtener franquicias con el conteo de animes y ordenadas por nombre
    const franchises = await prisma.franquicia.findMany({
      orderBy: { nombre: 'asc' }, // Ordenar por nombre de franquicia
      include: {
        animes: true, // Obtener la lista de animes asociados
        _count: {
          select: {
            animes: true,
          },
        },
      },
    })

    // Obtener los animes standalone (sin franquicia)
    const standaloneAnimes = await prisma.anime.findMany({
      where: {
        id_franquicia: 2, // Animes sin franquicia
      },
      select: {
        id: true,
        title: true,
        image: true,
      },
    })

    // Convertir los standalone animes en "franquicias"
    const standaloneFranchises = standaloneAnimes.map((anime) => ({
      id: `standalone-${anime.id}`, // ID único para distinguirlos
      nombre: `${anime.title} ST`, // Nombre del anime
      imagen: anime.image, // Imagen del anime
      cantidadAnimes: 1, // Siempre será 1
    }))

    // Unir ambas listas (franquicias y standalone animes)
    const allFranchises = [
      ...franchises.map((fr) => ({
        id: fr.id_franquicia,
        nombre: fr.nombre,
        imagen: fr.imagen,
        cantidadAnimes: fr._count.animes,
      })),
      ...standaloneFranchises,
    ]

    // Aplicar paginación manualmente después de combinar la lista
    const total = totalFranchises + standaloneAnimes.length
    const paginatedFranchises = allFranchises.slice(skip, skip + Number(limit))

    reply.send({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data: paginatedFranchises,
    })
  } catch (error) {
    console.error('Error al obtener franquicias:', error)
    reply.status(500).send({ error: 'Error interno del servidor' })
  }
})

app.get('/api/allAnimesFranchiesById', async (request, reply) => {
  console.log('request.query:', request.query)
  try {
    const { id_franquicia } = request.query as { id_franquicia: number }

    const animes = await prisma.anime.findMany({
      where: {
        id_franquicia: +id_franquicia,
      },
    })

    reply.send(animes)
  } catch (error) {
    console.error('Error al obtener franquicias:', error)
    reply.status(500).send({ error: 'Error interno del servidor' })
  }
})
// Ruta para obtener la lista de animes
app.get('/api/animes', async (request, reply) => {
  try {
    const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number }

    const skip = (page - 1) * +limit

    const animes = await prisma.anime.findMany({
      skip,
      take: +limit,
      orderBy: { year: 'desc' },
    })

    const total = await prisma.anime.count()

    reply.send({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / +limit),
      data: animes,
    })
  } catch (error) {
    console.error('Error al obtener animes:', error)
    reply.status(500).send({ error: 'Error interno del servidor' })
  }
})
// Iniciar el servidor en el puerto 3000
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 API corriendo en http://localhost:3000')
  } catch (err) {
    console.error('Error al iniciar el servidor:', err)
    process.exit(1)
  }
}

start().catch((err) => {
  console.error('Error al iniciar el servidor:', err)
  process.exit(1)
})
