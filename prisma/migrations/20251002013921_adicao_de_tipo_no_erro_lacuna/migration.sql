/*
  Warnings:

  - Added the required column `tipo` to the `ErroLacuna` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoErroLacuna" AS ENUM ('Erro', 'Lacuna');

-- AlterTable
ALTER TABLE "ErroLacuna" ADD COLUMN     "tipo" "TipoErroLacuna" NOT NULL;
