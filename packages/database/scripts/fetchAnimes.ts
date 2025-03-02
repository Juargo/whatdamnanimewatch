import axios, { AxiosResponse } from 'axios'
import { PrismaClient } from '@prisma/client'
// import { PrismaClientKnownRequestError } from '@prisma/client'
import pLimit from 'p-limit'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

import { AnimeRes, MyAnimeData, Pagination } from '../myanimelist-model'

const prisma = new PrismaClient()

const API_BASE_URL = 'https://api.jikan.moe/v4/anime?'
const limit = pLimit(3) // 🔹 Límite de concurrencia (3 solicitudes por segundo)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// async function getAvailableModels() {
//   try {
//     const response = await openai.models.list()
//     console.log('✅ Modelos disponibles en tu cuenta:')
//     response.data.forEach((model) => console.log(model.id))
//   } catch (error) {
//     console.error('❌ Error obteniendo modelos:', error)
//   }
// }

async function getFranchisesBatch(animes: MyAnimeData[]): Promise<Record<string, string>> {
  await sleep(500)
  // Usar mal_id como identificador único para cada anime
  const animeDetails = animes.map((a) => `{"title": "${a.title}", "id": ${a.mal_id}}`).join(', ')
  const prompt = `Dado estos animes: [${animeDetails}], dime solo el nombre de la franquicia a la que pertenecen, como \"Naruto\", \"Dragon Ball\", \"One Piece\". Si no pertenecen a ninguna, responde \"Standalone\". Devuelve un JSON con el formato {\"animeTitle1\": \"Franchise1\", \"animeTitle2\": \"Franchise2\"}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      store: true,
    })
    let responseText = completion.choices[0]?.message?.content?.trim() || '{}'

    // 🔥 Limpiar etiquetas Markdown si están presentes
    responseText = responseText.replace(/```json|```/g, '').trim()

    console.log('📝 Respuesta de GPT batch:', responseText)

    return JSON.parse(responseText) as Record<string, string>
  } catch (error) {
    console.error(`❌ Error en GPT batch:`, error)
    return {}
  }
}

async function fetchAnimesByPage(
  page: number
): Promise<{ data: MyAnimeData[]; pagination: Pagination }> {
  try {
    console.log(`📌 Solicitando página ${page}...`)
    await sleep(550)

    const response: AxiosResponse<{ data: AnimeRes[]; pagination: Pagination }> = await axios.get<{
      data: AnimeRes[]
      pagination: Pagination
    }>(`${API_BASE_URL}&page=${page}`, {})

    if (!response || !response.data) {
      console.log(`⚠️ No se encontró información para la página ${page}`)
      return {
        data: [],
        pagination: { last_visible_page: 0, has_next_page: false, current_page: page },
      }
    }

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
    franchise: '',
  }))
}

async function fetchAndInsertAnimes() {
  console.log('📥 Poblando base de datos...')
  console.log(
    '🔍 OpenAI API Key:',
    process.env.OPENAI_API_KEY ? 'Cargado correctamente' : 'No encontrado'
  )

  // Conjunto global para rastrear todos los mal_ids procesados en la sesión
  const processedGlobalMalIds = new Set<number>()

  let page = 1065
  let hasNextPage = true
  let totalPages = 1

  while (hasNextPage) {
    console.log(`📌 Obteniendo página ${page}...`)
    const { data: animes, pagination } = await limit(() => fetchAnimesByPage(page))

    if (animes.length === 0) {
      console.log(`⚠️ No hay animes en la página ${page}. Terminando...`)
      break
    }

    if (page === 1) {
      totalPages = pagination.last_visible_page
      console.log(`📊 Total de páginas: ${totalPages}`)
    }

    for (let i = 0; i < animes.length; i += 10) {
      console.log(
        `📌 Obteniendo franquicias para el lote ${i + 1}-${Math.min(i + 10, animes.length)}...`
      )

      // Filtrar duplicados por mal_id antes de procesar el lote
      const batch = animes.slice(i, i + 10).filter((anime) => {
        if (processedGlobalMalIds.has(anime.mal_id)) {
          console.warn(
            `⚠️ Anime duplicado con mal_id ${anime.mal_id} detectado en datos fuente. Saltando...`
          )
          return false
        }
        processedGlobalMalIds.add(anime.mal_id)
        return true
      })

      // Si todos los animes del lote fueron filtrados como duplicados, pasar al siguiente lote
      if (batch.length === 0) {
        console.log('⏩ Lote completo de duplicados, pasando al siguiente...')
        continue
      }
      const franchises = await getFranchisesBatch(batch)

      // Crear un conjunto para controlar duplicados dentro del mismo lote
      const processedMalIds = new Set<number>()

      const promises = batch.map(async (anime) => {
        // Asignar franquicia desde la respuesta de GPT
        anime.franchise = franchises[anime.title] || 'Unknown'

        try {
          // Verificar si el mal_id ya fue procesado en este lote
          if (processedMalIds.has(anime.mal_id)) {
            console.warn(
              `⚠️ Anime duplicado en el lote actual (mal_id: ${anime.mal_id}). Saltando...`
            )
            return null
          }

          // Marcar este mal_id como procesado
          processedMalIds.add(anime.mal_id)

          // Verificar si ya existe en la base de datos
          const existingAnime = await prisma.anime.findUnique({ where: { mal_id: anime.mal_id } })

          if (existingAnime) {
            const hasChanges =
              existingAnime.title !== anime.title ||
              existingAnime.image !== anime.image ||
              existingAnime.status !== anime.status ||
              existingAnime.score !== anime.score ||
              existingAnime.year !== anime.year

            if (hasChanges) {
              console.log(`🔄 Actualizando anime: ${anime.title} | Franquicia: ${anime.franchise}`)
              return prisma.anime.update({ where: { mal_id: anime.mal_id }, data: anime })
            }
            return null // No requiere cambios
          } else {
            console.log(
              `🆕 Insertando nuevo anime: ${anime.title} | Franquicia: ${anime.franchise}`
            )
            return prisma.anime.create({
              data: {
                mal_id: anime.mal_id,
                url: anime.url,
                title: anime.title,
                franchise: anime.franchise,
                image: anime.image,
                type: anime.type,
                episodes: anime.episodes,
                status: anime.status,
                score: anime.score,
                synopsis: anime.synopsis,
                year: anime.year,
                genres: anime.genres,
                demographics: anime.demographics,
              },
            })
          }
        } catch (error) {
          if (error instanceof prisma.PrismaClientKnownRequestError) {
            // P2002 = Unique constraint failed
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error.code === 'P2002') {
              console.error(
                `❌ Se detectó un registro duplicado en mal_id: ${anime.mal_id}. Saltando...`
              )
              return null
            }
          }
          // Registrar el error pero no detener el proceso completo
          console.error(`❌ Error al procesar anime ${anime.title}:`, error)
          return null
        }
      })

      // Filtrar resultados nulos o rechazados para que no detengan el proceso
      const results = await Promise.allSettled(promises)

      // Reportar errores pero continuar con la ejecución
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ Error en promesa ${index}:`, result.reason)
        }
      })
    }

    const progress = ((page / totalPages) * 100).toFixed(2)
    console.log(`🚀 Progreso: ${progress}% (${page}/${totalPages})`)

    page = pagination.current_page + 1
    hasNextPage = pagination.has_next_page
  }

  console.log('✅ ¡Datos insertados correctamente en la BD!')
}

async function main() {
  try {
    await fetchAndInsertAnimes()
    // await getAvailableModels()
  } catch (e) {
    console.error('❌ Error al poblar la base de datos:', e)
    console.error(
      'El proceso se detuvo con error, pero los datos guardados anteriormente permanecen en la base de datos.'
    )
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('❌ Unhandled error:', error)
  process.exit(1)
})
