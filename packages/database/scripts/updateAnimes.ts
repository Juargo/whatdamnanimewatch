import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function assignRealFranchiseIds() {
  // 1. Obtener todos los animes
  const animes = await prisma.anime.findMany()

  let updatedCount = 0
  let skippedCount = 0

  for (const anime of animes) {
    // Si no tiene 'franchise' o está vacío, lo saltamos
    if (!anime.franchise || !anime.franchise.trim()) {
      skippedCount++
      continue
    }

    const franchiseName = anime.franchise.trim()
    // 2. Buscar la franquicia correspondiente
    const foundFranchise = await prisma.franquicia.findUnique({
      where: { nombre: franchiseName },
    })

    // Si no existe la franquicia, podemos:
    // A) crearla
    // B) saltar
    // Depende de tu lógica. Aquí haremos un skip si no la encuentra.
    if (!foundFranchise) {
      console.log(
        `❌ No existe franquicia con nombre = "${franchiseName}". Saltando anime ID="${anime.id}".`
      )
      skippedCount++
      continue
    }

    // 3. Actualizar el anime con el id_franquicia real
    await prisma.anime.update({
      where: { id: anime.id },
      data: {
        id_franquicia: foundFranchise.id_franquicia,
      },
    })
    updatedCount++
    console.log(
      `✅ Anime "${anime.title}" (ID: ${anime.id}) -> id_franquicia=${foundFranchise.id_franquicia}`
    )
  }

  console.log(
    `\nProceso finalizado. Animes actualizados: ${updatedCount}, Animes saltados: ${skippedCount}`
  )
}

async function main() {
  try {
    await assignRealFranchiseIds()
  } catch (error) {
    console.error('❌ Error al asignar franquicias:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('❌ Error no controlado:', err)
  process.exit(1)
})
