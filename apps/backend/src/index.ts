import Fastify from 'fastify'
import cors, { FastifyCorsOptions } from '@fastify/cors'
import { PrismaClient, Prisma } from '@prisma/client'

const app = Fastify()
let prisma: PrismaClient

// Función para inicializar Prisma con manejo de errores
const initPrisma = async () => {
  try {
    prisma = new PrismaClient()
    // Realizar una consulta simple para verificar la conexión
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Conexión a la base de datos establecida correctamente')
    return true
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:')
    console.error(error)
    console.error('\n📋 Por favor verifica:')
    console.error('1. Que el servidor PostgreSQL esté en ejecución')
    console.error('2. Que exista la base de datos "whatdamnanimewatch"')
    console.error('3. Que las credenciales en el archivo .env sean correctas')
    console.error('\n💡 Puedes crear la base de datos con el comando:')
    console.error('   createdb whatdamnanimewatch')
    console.error('\n💡 O verificar tu archivo .env y ajustar la URL de conexión:')
    console.error(
      '   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/minombredebasededatos"'
    )
    return false
  }
}

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
    // Verificar que Prisma esté inicializado
    if (!prisma) {
      return reply.status(500).send({ error: 'La base de datos no está disponible' })
    }

    // Leer "page", "limit" y la nueva opción "letra" de la query
    const query = request.query as Record<string, string>
    const page = query.page ? parseInt(query.page) : 1
    const limit = query.limit ? parseInt(query.limit) : 10
    const letra = query.letra || '#'

    const skip = (page - 1) * limit

    // Construir condición para filtrar por letra inicial si se proporciona
    let whereCondition: Prisma.FranquiciaWhereInput = {}

    if (letra) {
      if (letra === '#') {
        // Para '#', buscamos franquicias que NO empiecen con letras (a-z, A-Z)
        whereCondition = {
          OR: [
            { nombre: { startsWith: '0' } },
            { nombre: { startsWith: '1' } },
            { nombre: { startsWith: '2' } },
            { nombre: { startsWith: '3' } },
            { nombre: { startsWith: '4' } },
            { nombre: { startsWith: '5' } },
            { nombre: { startsWith: '6' } },
            { nombre: { startsWith: '7' } },
            { nombre: { startsWith: '8' } },
            { nombre: { startsWith: '9' } },
            { nombre: { startsWith: '-' } },
            { nombre: { startsWith: '_' } },
            { nombre: { startsWith: '.' } },
            { nombre: { startsWith: '!' } },
            { nombre: { startsWith: '?' } },
            // Puedes añadir más caracteres especiales aquí si es necesario
          ],
        }
      } else {
        // Para cualquier otra letra, buscamos franquicias que empiecen con esa letra
        whereCondition = {
          nombre: {
            startsWith: letra,
            mode: 'insensitive', // Para que no distinga entre mayúsculas y minúsculas
          },
        }
      }
    }

    // Contar franquicias con el filtro aplicado
    const totalFranchises = await prisma.franquicia.count({
      where: whereCondition,
    })

    // Obtener franquicias filtradas y con conteo de animes
    const franchises = await prisma.franquicia.findMany({
      where: whereCondition,
      orderBy: { nombre: 'asc' },
      include: {
        animes: true,
        _count: {
          select: {
            animes: true,
          },
        },
      },
    })

    // Filtrar animes standalone según la letra
    let standaloneAnimesWhereCondition: Prisma.AnimeWhereInput = {
      id_franquicia: 2, // Animes sin franquicia
    }

    if (letra) {
      if (letra === '#') {
        // Para '#', buscar títulos que NO empiecen con letras
        standaloneAnimesWhereCondition = {
          AND: [
            { id_franquicia: 2 },
            {
              OR: [
                { title: { startsWith: '0' } },
                { title: { startsWith: '1' } },
                { title: { startsWith: '2' } },
                { title: { startsWith: '3' } },
                { title: { startsWith: '4' } },
                { title: { startsWith: '5' } },
                { title: { startsWith: '6' } },
                { title: { startsWith: '7' } },
                { title: { startsWith: '8' } },
                { title: { startsWith: '9' } },
                { title: { startsWith: '-' } },
                { title: { startsWith: '_' } },
                { title: { startsWith: '.' } },
                { title: { startsWith: '!' } },
                { title: { startsWith: '?' } },
                // Puedes añadir más caracteres especiales aquí si es necesario
              ],
            },
          ],
        }
      } else {
        // Para cualquier otra letra, buscar títulos que empiecen con esa letra
        standaloneAnimesWhereCondition = {
          AND: [
            { id_franquicia: 2 },
            {
              title: {
                startsWith: letra,
                mode: 'insensitive',
              },
            },
          ],
        }
      }
    }

    // Obtener los animes standalone con el filtro aplicado
    const standaloneAnimes = await prisma.anime.findMany({
      where: standaloneAnimesWhereCondition,
      select: {
        id: true,
        title: true,
        image: true,
      },
    })

    // Interfaces para mejorar el tipado
    interface FranchiseData {
      id: number | string
      nombre: string
      imagen: string | null
      cantidadAnimes: number
    }

    // Convertir los standalone animes en "franquicias"
    const standaloneFranchises: FranchiseData[] = standaloneAnimes.map((anime) => ({
      id: `standalone-${anime.id}`,
      nombre: `${anime.title} ST`,
      imagen: anime.image,
      cantidadAnimes: 1,
    }))

    // Unir ambas listas (franquicias y standalone animes)
    const allFranchises: FranchiseData[] = [
      ...franchises.map((fr) => ({
        id: fr.id_franquicia,
        nombre: fr.nombre,
        imagen: fr.imagen,
        cantidadAnimes: fr._count.animes,
      })),
      ...standaloneFranchises,
    ]

    // Calcular totales para paginación
    const total = totalFranchises + standaloneAnimes.length

    // Si necesitamos agrupar por letra (cuando no hay filtro específico)
    if (!letra) {
      // Agrupar franquicias por letra inicial
      const franchisesByLetter: Record<string, FranchiseData[]> = {}

      allFranchises.forEach((franchise) => {
        const firstChar = franchise.nombre.charAt(0).toUpperCase()
        const group = /^[A-Z]$/i.test(firstChar) ? firstChar.toUpperCase() : '#'

        if (!franchisesByLetter[group]) {
          franchisesByLetter[group] = []
        }

        franchisesByLetter[group].push(franchise)
      })

      reply.send({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: franchisesByLetter,
      })
    } else {
      // Si hay un filtro por letra, aplicamos paginación a la lista filtrada
      const paginatedFranchises = allFranchises.slice(skip, skip + limit)

      reply.send({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: paginatedFranchises,
      })
    }
  } catch (error) {
    console.error('Error al obtener franquicias:', error)
    reply.status(500).send({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
    })
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
    // Intentar inicializar Prisma antes de iniciar el servidor
    const prismaConnected = await initPrisma()

    if (!prismaConnected) {
      console.warn(
        '⚠️ Iniciando servidor sin conexión a la base de datos. Algunas funciones no estarán disponibles.'
      )
    }

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
