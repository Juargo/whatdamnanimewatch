import Fastify from 'fastify'
import { formatTitle } from '@whatdamnanimewatch/shared'

console.log(formatTitle('¡Bienvenido!'))

const fastify = Fastify({ logger: true })

fastify.get('/', async (_, reply) => {
  reply.send({ message: '¡Bienvenido a WTFAnimeWatch API!' })
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  console.log(`🚀 Servidor corriendo en ${address}`)
})
