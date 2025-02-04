-- CreateTable
CREATE TABLE "Anime" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "genres" TEXT,
    "demographic" TEXT,
    "year" INTEGER,
    "status" TEXT,
    "score" DOUBLE PRECISION,
    "openingUrl" TEXT,
    "endingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);
