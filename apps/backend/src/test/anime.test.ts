import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = Fastify()

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})
const prisma = new PrismaClient()

app.get('/api/animes', async (_, reply) => {
  const animes = await prisma.anime.findMany()
  reply.send(animes)
})

describe('API de animes', () => {
  it('Debe devolver una lista de animes', async () => {
    try {
      const res = await app.inject({
        method: 'GET',
        url: '/api/animes?page=1&limit=5',
      })
      console.log('🚀 Respuesta:', res)
      console.log('🚀 Cuerpo:', res.body)
      console.log('🚀 Código de estado:', res.statusCode)
      console.log('🚀 Es un array:', Array.isArray(JSON.parse(res.body)))
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(JSON.parse(res.body))).toBe(true)
    } catch (error) {
      console.error('❌ Error en la solicitud:', error)
      throw new Error('Fallo la prueba: No se pudo obtener la lista de animes')
    }
  })
})
