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
