import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// async function parseAnimeData() {
//   // 1. Obtener todos los animes de la DB
//   const animes = await prisma.anime.findMany()

//   for (const anime of animes) {
//     console.log(`\n--- Procesando anime: "${anime.title}" (ID: ${anime.id}) ---`)

//     // =========================================
//     // A) Manejo de 'franchise' -> Franquicia
//     // =========================================
//     if (anime.franchise && anime.franchise.trim() !== '') {
//       // Quitamos espacios en blanco
//       const franchiseName = anime.franchise.trim()

//       // Buscamos o creamos la franquicia
//       // (siempre es bueno normalizar, e.g. "Naruto" vs "Naruto " o "naruto"?)
//       const franquicia = await prisma.franquicia.upsert({
//         where: { nombre: franchiseName },
//         create: { nombre: franchiseName },
//         update: {}, // si ya existe, no actualizamos nada
//       })

//       console.log(`   ✅ Vinculada franquicia: ${franquicia.nombre}`)
//     }

//     // =========================================
//     // B) Manejo de 'genres' -> (AnimeGenero)
//     // =========================================
//     if (anime.genres && anime.genres.trim() !== '') {
//       // Ejemplo: "Action, Comedy, Fantasy"
//       // Convertimos a array. Ajusta según tu separador
//       const genresArray = anime.genres.split(',').map((g) => g.trim())

//       for (const gen of genresArray) {
//         // Evita strings vacíos
//         if (!gen) continue

//         // 1. Buscamos o creamos el género
//         const genero = await prisma.genero.upsert({
//           where: { nombre: gen }, // asumiendo 'nombre' es único en Genero
//           create: { nombre: gen },
//           update: {},
//         })

//         // 2. Insertamos registro en tabla puente
//         //    para vincular este anime con el género
//         //    (id_anime = anime.id, id_genero = genero.id_genero)
//         try {
//           await prisma.animeGenero.create({
//             data: {
//               id_anime: anime.id,
//               id_genero: genero.id_genero,
//             },
//           })
//           console.log(`   ✅ Vinculado género: ${gen}`)
//         } catch (error) {
//           // Si ya existe la relación, dará error unique
//           // Podemos ignorarlo (o manejarlo de otra forma)
//           if (error instanceof prisma.PrismaClientKnownRequestError) {
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//             if (error.code === 'P2002') {
//               console.log(`   ⚠️ Género repetido: ${gen} (ya vinculado)`)
//             } else {
//               // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//               console.error(`   ❌ Error insertando AnimeGenero:`, error.message)
//             }
//           } else {
//             console.error(`   ❌ Error inesperado:`, error)
//           }
//         }
//       }
//     }

//     // =========================================
//     // C) Manejo de 'demographics' -> Demografia
//     // =========================================
//     if (anime.demographics && anime.demographics.trim() !== '') {
//       // Ejemplo: "Shounen, Seinen"
//       const demoArray = anime.demographics.split(',').map((d) => d.trim())

//       for (const dem of demoArray) {
//         if (!dem) continue

//         // 1. Buscamos o creamos la demografía
//         const demografia = await prisma.demografia.upsert({
//           where: { nombre: dem },
//           create: { nombre: dem },
//           update: {},
//         })

//         // 2. Insertamos registro en la tabla puente
//         try {
//           await prisma.animeDemografia.create({
//             data: {
//               id_anime: anime.id,
//               id_demografia: demografia.id_demografia,
//             },
//           })
//           console.log(`   ✅ Vinculada demografía: ${dem}`)
//         } catch (error) {
//           if (error instanceof prisma.PrismaClientKnownRequestError) {
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//             if (error.code === 'P2002') {
//               console.log(`   ⚠️ Demografía repetida: ${dem} (ya vinculada)`)
//             } else {
//               // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//               console.error(`   ❌ Error insertando AnimeDemografia:`, error.message)
//             }
//           } else {
//             console.error(`   ❌ Error inesperado:`, error)
//           }
//         }
//       }
//     }
//   }
// }

async function migrateFranchiseImagesFromAnime() {
  // 1. Obtener todos los animes
  const animes = await prisma.anime.findMany()

  // 2. Crear un mapa: { "Naruto": [ { id, image }, ... ], "One Piece": [ { id, image } ], ... }
  const franchiseMap: Record<string, { id: string; image: string }[]> = {}

  for (const anime of animes) {
    if (!anime.franchise || !anime.franchise.trim()) continue

    const franchiseName = anime.franchise.trim()
    const animeImage = anime.image ?? ''

    // Inicializamos el array si no existe
    if (!franchiseMap[franchiseName]) {
      franchiseMap[franchiseName] = []
    }

    franchiseMap[franchiseName].push({
      id: anime.id,
      image: animeImage,
    })
  }

  // 3. Para cada franquicia, buscar el primer anime que tenga una imagen no vacía
  for (const franchiseName of Object.keys(franchiseMap)) {
    // Toma la lista de animes de esta franquicia
    const animeList = franchiseMap[franchiseName]

    // Filtra los que tienen image no vacía
    const withImage = animeList.filter((a) => a.image && a.image.trim() !== '')

    if (withImage.length === 0) {
      console.log(`❌ No hay imagen disponible para la franquicia "${franchiseName}"`)
      continue
    }

    // Elige el primero (o podrías implementar otra lógica)
    const firstWithImage = withImage[0]
    console.log(
      `\nFranquicia "${franchiseName}" -> tomamos imagen de animeId="${firstWithImage.id}" = ${firstWithImage.image}`
    )

    try {
      // 4. Upsert en la tabla 'Franquicia'
      //    - "where: { nombre: franchiseName }" asume que 'nombre' es único en Franquicia
      const updatedFranq = await prisma.franquicia.upsert({
        where: { nombre: franchiseName },
        create: {
          nombre: franchiseName,
          imagen: firstWithImage.image,
        },
        update: {
          // Si ya existe, actualizamos el campo 'imagen'
          imagen: firstWithImage.image,
        },
      })

      console.log(
        `   ✅ Franquicia actualizada/creada: "${updatedFranq.nombre}" con imagen: ${updatedFranq.imagen}`
      )
    } catch (error) {
      console.error(`   ❌ Error actualizando/creando franquicia "${franchiseName}":`, error)
    }
  }
}

async function main() {
  try {
    await migrateFranchiseImagesFromAnime()
    console.log('\n✅ Parseo completado con éxito.')
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
