/*
  Warnings:

  - The values [MASCULINO,FEMININO,OUTRO] on the enum `Genero` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Genero_new" AS ENUM ('Masculino', 'Feminino', 'Outro');
ALTER TABLE "Usuario" ALTER COLUMN "genero" TYPE "Genero_new" USING ("genero"::text::"Genero_new");
ALTER TYPE "Genero" RENAME TO "Genero_old";
ALTER TYPE "Genero_new" RENAME TO "Genero";
DROP TYPE "Genero_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_rankId_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "rankId" DROP NOT NULL,
ALTER COLUMN "nivel" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
