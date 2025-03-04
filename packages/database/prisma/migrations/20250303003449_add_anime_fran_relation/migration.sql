/*
  Warnings:

  - Made the column `id_franquicia` on table `Anime` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Anime" DROP CONSTRAINT "Anime_id_franquicia_fkey";

-- AlterTable
ALTER TABLE "Anime" ALTER COLUMN "id_franquicia" SET NOT NULL,
ALTER COLUMN "id_franquicia" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Anime" ADD CONSTRAINT "Anime_id_franquicia_fkey" FOREIGN KEY ("id_franquicia") REFERENCES "Franquicia"("id_franquicia") ON DELETE RESTRICT ON UPDATE CASCADE;
