// import { PrismaClient } from '@whatdamnanimewatch/database' // Asegúrate que este import es correcto
import axios, { AxiosResponse } from 'axios'
import { AnimeRes, MyAnimeBase, Pagination } from '../myanimelist-model'

// const prisma = new PrismaClient()

// 🎯 Obtener animes desde Jikan API filtrando por año
async function fetchAnimesByYear() {
  try {
    const response: AxiosResponse<{ data: AnimeRes[]; pagination: Pagination }> = await axios.get<{
      data: AnimeRes[]
      pagination: Pagination
    }>('https://api.jikan.moe/v4/anime?type=tv', {})

    const current_page = response.data.pagination.current_page
    const has_next_page = response.data.pagination.has_next_page
    const last_visible_page = response.data.pagination.last_visible_page

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
        pagination: {
          current_page: current_page,
          has_next_page: has_next_page,
          last_visible_page: last_visible_page,
        },
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

  const animes = await fetchAnimesByYear()

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
