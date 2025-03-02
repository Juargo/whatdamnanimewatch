-- CreateTable
CREATE TABLE "Franquicia" (
    "id_franquicia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Franquicia_pkey" PRIMARY KEY ("id_franquicia")
);

-- CreateTable
CREATE TABLE "Genero" (
    "id_genero" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id_genero")
);

-- CreateTable
CREATE TABLE "Demografia" (
    "id_demografia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Demografia_pkey" PRIMARY KEY ("id_demografia")
);

-- CreateTable
CREATE TABLE "Pais" (
    "id_pais" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "AnimeGenero" (
    "id_anime" TEXT NOT NULL,
    "id_genero" INTEGER NOT NULL,

    CONSTRAINT "AnimeGenero_pkey" PRIMARY KEY ("id_anime","id_genero")
);

-- CreateTable
CREATE TABLE "AnimeDemografia" (
    "id_anime" TEXT NOT NULL,
    "id_demografia" INTEGER NOT NULL,

    CONSTRAINT "AnimeDemografia_pkey" PRIMARY KEY ("id_anime","id_demografia")
);

-- CreateTable
CREATE TABLE "AnimePais" (
    "id_anime" TEXT NOT NULL,
    "id_pais" INTEGER NOT NULL,

    CONSTRAINT "AnimePais_pkey" PRIMARY KEY ("id_anime","id_pais")
);

-- AddForeignKey
ALTER TABLE "AnimeGenero" ADD CONSTRAINT "AnimeGenero_id_anime_fkey" FOREIGN KEY ("id_anime") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeGenero" ADD CONSTRAINT "AnimeGenero_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "Genero"("id_genero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeDemografia" ADD CONSTRAINT "AnimeDemografia_id_anime_fkey" FOREIGN KEY ("id_anime") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeDemografia" ADD CONSTRAINT "AnimeDemografia_id_demografia_fkey" FOREIGN KEY ("id_demografia") REFERENCES "Demografia"("id_demografia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimePais" ADD CONSTRAINT "AnimePais_id_anime_fkey" FOREIGN KEY ("id_anime") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimePais" ADD CONSTRAINT "AnimePais_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "Pais"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;
