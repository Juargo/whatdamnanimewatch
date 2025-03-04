/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Demografia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Genero` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Pais` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Demografia_nombre_key" ON "Demografia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Genero_nombre_key" ON "Genero"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pais_nombre_key" ON "Pais"("nombre");
