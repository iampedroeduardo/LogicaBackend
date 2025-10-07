-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Repeticao');

-- DropForeignKey
ALTER TABLE "Algoritmo" DROP CONSTRAINT "Algoritmo_rankId_fkey";

-- DropForeignKey
ALTER TABLE "MultiplaEscolha" DROP CONSTRAINT "MultiplaEscolha_rankId_fkey";

-- AlterTable
ALTER TABLE "Algoritmo" ADD COLUMN     "categoria" "Categoria",
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "script" DROP NOT NULL,
ALTER COLUMN "rankId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ErroLacuna" ALTER COLUMN "nivel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MultiplaEscolha" ADD COLUMN     "pergunta" TEXT,
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "gabarito" DROP NOT NULL,
ALTER COLUMN "opcao1" DROP NOT NULL,
ALTER COLUMN "opcao2" DROP NOT NULL,
ALTER COLUMN "opcao3" DROP NOT NULL,
ALTER COLUMN "opcao4" DROP NOT NULL,
ALTER COLUMN "nivel" DROP NOT NULL,
ALTER COLUMN "rankId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Algoritmo" ADD CONSTRAINT "Algoritmo_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplaEscolha" ADD CONSTRAINT "MultiplaEscolha_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
