-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('Masculino', 'Feminino', 'Outro');

-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('RaciocinioLogico', 'Programacao');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Repeticao');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Aprovado', 'Negado', 'Pendente', 'Rascunho');

-- CreateEnum
CREATE TYPE "CorPerfil" AS ENUM ('Preto', 'Azul', 'Rosa', 'Amarelo');

-- CreateEnum
CREATE TYPE "AcessorioPerfil" AS ENUM ('None', 'Bone', 'Coroa', 'Tiara', 'Cartola', 'Oculos', 'Squirtle', 'Palhaco');

-- CreateEnum
CREATE TYPE "TipoErroLacuna" AS ENUM ('Erro', 'Lacuna');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "genero" "Genero" NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "Tipo",
    "adm" BOOLEAN NOT NULL,
    "token" TEXT,
    "cor" "CorPerfil" NOT NULL,
    "acessorio" "AcessorioPerfil" NOT NULL,
    "rankId" INTEGER,
    "nivel" INTEGER,
    "xp" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "cor" TEXT NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Algoritmo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "script" TEXT,
    "ativo" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "categoria" "Categoria",
    "rankId" INTEGER,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Algoritmo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiplaEscolha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "gabarito" TEXT,
    "pergunta" TEXT,
    "ativo" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "opcao1" TEXT,
    "opcao2" TEXT,
    "opcao3" TEXT,
    "opcao4" TEXT,
    "nivel" INTEGER,
    "categoria" "Categoria",
    "rankId" INTEGER,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "MultiplaEscolha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoAlgoritmo" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "acertou" BOOLEAN NOT NULL,
    "tipo" "TipoErroLacuna" NOT NULL,
    "algoritmoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "HistoricoAlgoritmo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoErroLacuna" (
    "id" SERIAL NOT NULL,
    "historicoId" INTEGER NOT NULL,
    "erroLacunaId" INTEGER NOT NULL,

    CONSTRAINT "HistoricoErroLacuna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoMultiplaEscolha" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "opcao" TEXT NOT NULL,
    "multiplaEscolhaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "HistoricoMultiplaEscolha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErroLacuna" (
    "id" SERIAL NOT NULL,
    "posicaoInicial" INTEGER NOT NULL,
    "posicaoFinal" INTEGER NOT NULL,
    "nivel" INTEGER,
    "algoritmoId" INTEGER NOT NULL,
    "tipo" "TipoErroLacuna" NOT NULL,

    CONSTRAINT "ErroLacuna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distrator" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "erroLacunaId" INTEGER NOT NULL,

    CONSTRAINT "Distrator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algoritmo" ADD CONSTRAINT "Algoritmo_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algoritmo" ADD CONSTRAINT "Algoritmo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplaEscolha" ADD CONSTRAINT "MultiplaEscolha_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplaEscolha" ADD CONSTRAINT "MultiplaEscolha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlgoritmo" ADD CONSTRAINT "HistoricoAlgoritmo_algoritmoId_fkey" FOREIGN KEY ("algoritmoId") REFERENCES "Algoritmo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlgoritmo" ADD CONSTRAINT "HistoricoAlgoritmo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoErroLacuna" ADD CONSTRAINT "HistoricoErroLacuna_historicoId_fkey" FOREIGN KEY ("historicoId") REFERENCES "HistoricoAlgoritmo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoErroLacuna" ADD CONSTRAINT "HistoricoErroLacuna_erroLacunaId_fkey" FOREIGN KEY ("erroLacunaId") REFERENCES "ErroLacuna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMultiplaEscolha" ADD CONSTRAINT "HistoricoMultiplaEscolha_multiplaEscolhaId_fkey" FOREIGN KEY ("multiplaEscolhaId") REFERENCES "MultiplaEscolha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMultiplaEscolha" ADD CONSTRAINT "HistoricoMultiplaEscolha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErroLacuna" ADD CONSTRAINT "ErroLacuna_algoritmoId_fkey" FOREIGN KEY ("algoritmoId") REFERENCES "Algoritmo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrator" ADD CONSTRAINT "Distrator_erroLacunaId_fkey" FOREIGN KEY ("erroLacunaId") REFERENCES "ErroLacuna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
