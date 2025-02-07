'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const vitest_1 = require('vitest')
const fastify_1 = __importDefault(require('fastify'))
const client_1 = require('@prisma/client')
const supertest_1 = __importDefault(require('supertest'))
const app = (0, fastify_1.default)()
const prisma = new client_1.PrismaClient()
app.get('/api/animes', async (_, reply) => {
  const animes = await prisma.anime.findMany()
  reply.send(animes)
})
;(0, vitest_1.describe)('API de animes', () => {
  ;(0, vitest_1.it)('Debe devolver una lista de animes', async () => {
    const res = await (0, supertest_1.default)(app.server).get('/api/animes')
    ;(0, vitest_1.expect)(res.status).toBe(200)
    ;(0, vitest_1.expect)(Array.isArray(res.body)).toBe(true)
  })
})
