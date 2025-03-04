-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "id_franquicia" INTEGER;

-- AddForeignKey
ALTER TABLE "Anime" ADD CONSTRAINT "Anime_id_franquicia_fkey" FOREIGN KEY ("id_franquicia") REFERENCES "Franquicia"("id_franquicia") ON DELETE SET NULL ON UPDATE CASCADE;
