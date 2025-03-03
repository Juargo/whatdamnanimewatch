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
app.get('/api/franchises', async (request, reply) => {
  try {
    // Leer "page" y "limit" de la query
    const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number }

    const skip = (Number(page) - 1) * Number(limit)

    // Contar cuántas franquicias hay en total (para paginación)
    const total = await prisma.franquicia.count()

    // Obtener las franquicias, incluyendo el conteo de "animes"
    // gracias al 'include: { _count: { select: { animes: true } } }'
    const franchises = await prisma.franquicia.findMany({
      skip,
      take: Number(limit),
      orderBy: { id_franquicia: 'asc' },
      include: {
        _count: {
          select: {
            animes: true,
          },
        },
      },
    })

    reply.send({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: franchises.map((fr: any) => {
        return {
          id: fr.id_franquicia,
          nombre: fr.nombre,
          url: fr.url,
          // otros campos que tengas en la tabla
          // ...
          cantidadAnimes: fr._count.animes,
        }
      }),
    })
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
