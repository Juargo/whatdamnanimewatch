/*
  Warnings:

  - You are about to drop the column `demographic` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `endingUrl` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `openingUrl` on the `Anime` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `Anime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genres` on table `Anime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `Anime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Anime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score` on table `Anime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "demographic",
DROP COLUMN "endingUrl",
DROP COLUMN "openingUrl",
ADD COLUMN     "demographics" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "episodes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mal_id" INTEGER,
ADD COLUMN     "synopsis" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "genres" SET NOT NULL,
ALTER COLUMN "genres" SET DEFAULT '',
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 0.0;
