import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const anime = await prisma.anime.create({
    data: {
      title: 'Attack on Titan',
      type: 'TV',
      genres: 'Action, Drama',
      demographic: 'Shonen',
      year: 2013,
      status: 'Finished',
      score: 9.2,
      openingUrl: 'https://youtu.be/6cF63aIztCw',
      endingUrl: 'https://youtu.be/jDPA-eVzVwU',
    },
  })

  console.log('Anime agregado:', anime)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    return prisma.$disconnect()
  })
