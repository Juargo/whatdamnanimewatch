// import { PrismaClient } from '@whatdamnanimewatch/database' // Asegúrate que este import es correcto
import axios, { AxiosResponse } from 'axios'

// const prisma = new PrismaClient()

const YEAR = 2024 // Cambia esto por el año deseado

interface AnimeRes {
  mal_id: number
  url: string
  titles: {
    type: string
    title: string
  }[]
  images: {
    jpg: {
      image_url: string
    }

    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  type: string
  episodes: number
  status: string
  score: number
  synopsis: string
  year: number
  genres: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  explicit_genres: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
  demographics: {
    mal_id: number
    type: string
    name: string
    url: string
  }[]
}

interface Pagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
}

interface MyAnimeBase {
  mal_id: number
  url: string
  title: string
  image: string
  type: string
  episodes: number
  status: string
  score: number
  synopsis: string
  year: number
  genres: string[]
  demographics: string[]
}

// 🎯 Obtener animes desde Jikan API filtrando por año
async function fetchAnimesByYear(year: number) {
  console.log(`📥 Obteniendo datos de animes del año ${year} desde Jikan API...`)

  try {
    const response: AxiosResponse<{ data: AnimeRes[] }> = await axios.get<{
      data: AnimeRes[]
      pagination: Pagination
    }>(
      'https://api.jikan.moe/v4/anime?start_date=' + year + '-01-01&end_date=' + year + '-12-31',
      {}
    )

    const an: MyAnimeBase[] = response.data.data.map((a: AnimeRes) => {
      return {
        mal_id: a.mal_id,
        url: a.url,
        title: a.titles.find((t) => t.type === 'English')?.title ?? a.titles[0].title,
        image: a.images.webp.large_image_url,
        type: a.type,
        episodes: a.episodes,
        status: a.status,
        score: a.score,
        synopsis: a.synopsis,
        year: a.year,
        genres: a.genres.map((g) => g.name),
        demographics: a.demographics.map((d) => d.name),
      }
    })

    // return animes
    return an
  } catch (error) {
    console.error('❌ Error al obtener datos de Jikan API:', error)
    return []
  }
}

// 🎯 Insertar animes en la base de datos
async function insertAnimes() {
  console.log('📥 Poblando base de datos...')

  const animes = await fetchAnimesByYear(YEAR)

  if (animes.length === 0) {
    console.log('❌ No se encontraron animes para insertar.')
    return
  }

  // animes.map((a: AnimeRes) => {
  //   console.log(a.titles.find((t) => t.type === 'English')?.title ?? a.titles[0].title)
  // })

  animes.map((a: MyAnimeBase) => {
    console.log(a)
  })
  //   for (const anime of animes) {
  //     await prisma.anime.upsert({
  //       where: { title: anime.title },
  //       update: anime,
  //       create: anime,
  //     })
  //   }

  //   console.log('✅ ¡Datos insertados correctamente en la BD!')
}

// 🚀 Ejecutar script
insertAnimes().catch((e) => {
  console.error('❌ Error al poblar la base de datos:', e)
  process.exit(1)
})
//   .finally(() => prisma.$disconnect())
