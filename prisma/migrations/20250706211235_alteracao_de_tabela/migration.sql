/*
  Warnings:

  - Added the required column `acessorio` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cor` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CorPerfil" AS ENUM ('Preto', 'Azul', 'Rosa', 'Amarelo');

-- CreateEnum
CREATE TYPE "AcessorioPerfil" AS ENUM ('None', 'Bone', 'Coroa', 'Tiara', 'Cartola', 'Oculos', 'Squirtle');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "acessorio" "AcessorioPerfil" NOT NULL,
ADD COLUMN     "cor" "CorPerfil" NOT NULL;
