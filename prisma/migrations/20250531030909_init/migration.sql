-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('RaciocinioLogico', 'Programacao');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Aprovado', 'Negado', 'Pendente', 'Rascunho');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "genero" "Genero" NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "adm" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "rankId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,

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
    "descricao" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "rankId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Algoritmo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiplaEscolha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "gabarito" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "opcao1" TEXT NOT NULL,
    "opcao2" TEXT NOT NULL,
    "opcao3" TEXT NOT NULL,
    "opcao4" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "rankId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "MultiplaEscolha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoAlgoritmo" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "acertou" BOOLEAN NOT NULL,
    "distratorId" INTEGER NOT NULL,
    "algoritmoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "HistoricoAlgoritmo_pkey" PRIMARY KEY ("id")
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
    "nivel" INTEGER NOT NULL,
    "algoritmoId" INTEGER NOT NULL,

    CONSTRAINT "ErroLacuna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distrator" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "erroLacunaId" INTEGER NOT NULL,

    CONSTRAINT "Distrator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algoritmo" ADD CONSTRAINT "Algoritmo_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algoritmo" ADD CONSTRAINT "Algoritmo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplaEscolha" ADD CONSTRAINT "MultiplaEscolha_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplaEscolha" ADD CONSTRAINT "MultiplaEscolha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlgoritmo" ADD CONSTRAINT "HistoricoAlgoritmo_distratorId_fkey" FOREIGN KEY ("distratorId") REFERENCES "Distrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlgoritmo" ADD CONSTRAINT "HistoricoAlgoritmo_algoritmoId_fkey" FOREIGN KEY ("algoritmoId") REFERENCES "Algoritmo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAlgoritmo" ADD CONSTRAINT "HistoricoAlgoritmo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMultiplaEscolha" ADD CONSTRAINT "HistoricoMultiplaEscolha_multiplaEscolhaId_fkey" FOREIGN KEY ("multiplaEscolhaId") REFERENCES "MultiplaEscolha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoMultiplaEscolha" ADD CONSTRAINT "HistoricoMultiplaEscolha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErroLacuna" ADD CONSTRAINT "ErroLacuna_algoritmoId_fkey" FOREIGN KEY ("algoritmoId") REFERENCES "Algoritmo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distrator" ADD CONSTRAINT "Distrator_erroLacunaId_fkey" FOREIGN KEY ("erroLacunaId") REFERENCES "ErroLacuna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
