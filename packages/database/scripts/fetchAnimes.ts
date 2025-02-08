import axios, { AxiosResponse } from 'axios'
import { PrismaClient } from '@prisma/client'
import pLimit from 'p-limit'

import { AnimeRes, MyAnimeData, Pagination } from '../myanimelist-model'

const prisma = new PrismaClient()

const API_BASE_URL = 'https://api.jikan.moe/v4/anime?type=tv'

// 🔹 Límite de concurrencia: 3 solicitudes por segundo
const limit = pLimit(3)

// 🔹 Espera antes de hacer la siguiente solicitud (para cumplir con el límite de 3/s y 60/min)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetches anime data from the Jikan API and returns it in a structured format.
 *
 * @returns {Promise<{ data: AnimeRes[]; pagination: Pagination }>} A promise that resolves to an object containing the anime data and pagination information.
 *
 * @throws Will log an error message if the API request fails and return an object with empty data and default pagination values.
 */
async function fetchAnimesByPage(
  page: number
): Promise<{ data: MyAnimeData[]; pagination: Pagination }> {
  try {
    console.log(`📌 Solicitando página ${page}...`)

    // Espera para cumplir con las restricciones de la API
    await sleep(350)

    // FETCH ANIME DATA
    const response: AxiosResponse<{ data: AnimeRes[]; pagination: Pagination }> = await axios.get<{
      data: AnimeRes[]
      pagination: Pagination
    }>(`${API_BASE_URL}&page=${page}`, {})

    if (!response || !response.data) {
      console.log(`No se encontró información para la página ${page}`)
      return {
        data: [],
        pagination: { last_visible_page: 0, has_next_page: false, current_page: page },
      }
    }

    console.log('url', `https://api.jikan.moe/v4/anime?type=tv&page=${page}`)
    console.log('pagination', response.data.pagination)
    // RETURN DATA AND PAGINATION
    return {
      data: dataFormatter(response.data.data),
      pagination: response.data.pagination,
    }
  } catch (error) {
    console.error(`❌ Error obteniendo datos de Jikan API en la página ${page}:`, error)
    return {
      data: [],
      pagination: { last_visible_page: 0, has_next_page: false, current_page: page },
    }
  }
}

/**
 * Formats an array of AnimeRes objects into an array of MyAnimeData objects.
 *
 * @param {AnimeRes[]} data - The array of AnimeRes objects to format.
 * @returns {MyAnimeData[]} The formatted array of MyAnimeData objects.
 */
function dataFormatter(data: AnimeRes[]): MyAnimeData[] {
  return data.map((a: AnimeRes) => ({
    mal_id: a.mal_id,
    url: a.url,
    title: a.titles.find((t) => t.type === 'English')?.title ?? a.titles[0].title,
    image: a.images.webp.large_image_url,
    type: a.type ?? 'UNKNOWN',
    episodes: a.episodes ?? -1,
    status: a.status ?? 'UNKNOWN',
    score: a.score ?? -1,
    synopsis: a.synopsis ?? 'UNKNOWN',
    year: a.year ?? -1,
    genres: a.genres.map((g) => g.name).join(', ') ?? 'UNKNOWN',
    demographics: a.demographics.map((d) => d.name).join(', ') ?? 'UNKNOWN',
  }))
}

async function fetchAndInsertAnimes() {
  console.log('📥 Poblando base de datos...')

  let page = 1
  let hasNextPage = true
  let totalPages = 1

  while (hasNextPage) {
    console.log(`📌 Obteniendo página ${page}...`)

    // Controlamos el límite de concurrencia con `p-limit`
    const { data: animes, pagination } = await limit(() => fetchAnimesByPage(page))

    if (animes.length === 0) {
      console.log(`⚠️ No hay animes en la página ${page}. Terminando...`)
      break
    }

    if (page === 1) {
      totalPages = pagination.last_visible_page
      console.log(`📊 Total de páginas: ${totalPages}`)
    }

    // 💾 Procesar cada anime y verificar si ya existe en la DB
    for (const anime of animes) {
      const existingAnime = await prisma.anime.findUnique({ where: { mal_id: anime.mal_id } })

      if (existingAnime) {
        // 🛠️ Verificar si hay cambios antes de actualizar
        const hasChanges = JSON.stringify(existingAnime) !== JSON.stringify(anime)
        if (hasChanges) {
          console.log(`🔄 Actualizando anime: ${anime.title}`)
          await prisma.anime.update({
            where: { mal_id: anime.mal_id },
            data: anime,
          })
        } else {
          console.log(`✅ Anime sin cambios: ${anime.title}`)
        }
      } else {
        console.log(`🆕 Insertando nuevo anime: ${anime.title}`)
        await prisma.anime.create({ data: anime })
      }
    }

    const progress = ((page / totalPages) * 100).toFixed(2)
    console.log(`🚀 Progreso: ${progress}% (${page}/${totalPages})`)

    // 📌 Pasar a la siguiente página si hay más datos
    page = pagination.current_page + 1
    hasNextPage = pagination.has_next_page
  }

  console.log('✅ ¡Datos insertados correctamente en la BD!')
}

// 🚀 Ejecutar script
async function main() {
  try {
    await fetchAndInsertAnimes()
  } catch (e) {
    console.error('❌ Error al poblar la base de datos:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect() // ✅ Se espera correctamente
  }
}

main().catch((error) => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})
