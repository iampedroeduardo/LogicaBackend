const prisma = require("../prisma/client");

module.exports.cadastrar = async (req, res) => {
  try {
    const { questoes } = req.body;
    const questoesIncorretas = questoes
      .map((window) => {
        if (
          (window.type === "multiplaEscolha" &&
            window.salvar &&
            (window.nome.trim().length === 0 ||
              window.pergunta.trim().length === 0 ||
              window.opcao1.trim().length === 0 ||
              window.opcao2.trim().length === 0 ||
              window.opcao3.trim().length === 0 ||
              window.opcao4.trim().length === 0 ||
              window.opcaoCorreta.length === 0 ||
              window.gabarito.trim().length === 0 ||
              window.descricao.trim().length === 0 ||
              window.categoria.trim().length === 0 ||
              ((window.tipo.trim().length === 0 ||
                window.rankId === null ||
                window.nivel === null) &&
                req.admin))) ||
          (window.type === "codigo" &&
            window.salvar &&
            (window.nome.trim().length === 0 ||
              window.descricao.trim().length === 0 ||
              window.script.trim().length === 0 ||
              window.errosLacuna.some(
                (x) => x.type === "error" && x.distratores.length === 0
              ) ||
              !(
                window.errosLacuna.filter((x) => x.type === "error").length >=
                  2 ||
                window.errosLacuna.filter((x) => x.type === "gap").length >= 2
              ) ||
              (window.rankId === null && req.admin)))
        ) {
          return window;
        }
      })
      .filter((x) => x !== undefined);
    console.log(questoesIncorretas);
    if (questoesIncorretas.length > 0) {
      return res.status(400).json(questoesIncorretas);
    }
    await prisma.$transaction(async (prisma) => {
      for (const questao of questoes) {
        if (questao.type === "multiplaEscolha") {
          const opcoes = [
            questao.opcao1,
            questao.opcao2,
            questao.opcao3,
            questao.opcao4,
          ];
          let opcaoCorreta = "";
          if (questao.opcaoCorreta === "a") {
            opcaoCorreta = questao.opcao1;
            opcoes.splice(0, 1);
          } else if (questao.opcaoCorreta === "b") {
            opcaoCorreta = questao.opcao2;
            opcoes.splice(1, 1);
          } else if (questao.opcaoCorreta === "c") {
            opcaoCorreta = questao.opcao3;
            opcoes.splice(2, 1);
          } else if (questao.opcaoCorreta === "d") {
            opcaoCorreta = questao.opcao4;
            opcoes.splice(3, 1);
          }
          console.log(questao.rankId, req.userId);
          await prisma.multiplaEscolha.create({
            data: {
              nome: questao.nome,
              descricao: questao.descricao,
              rankId: questao.rankId,
              opcao1: opcaoCorreta,
              opcao2: opcoes[0],
              opcao3: opcoes[1],
              opcao4: opcoes[2],
              pergunta: questao.pergunta,
              gabarito: questao.gabarito,
              nivel: questao.nivel,
              ativo: true,
              status: questao.salvar
                ? req.admin
                  ? "Aprovado"
                  : "Pendente"
                : "Rascunho",
              usuarioId: req.userId,
            },
          });
        } else if (questao.type === "codigo") {
          const algoritmo = await prisma.algoritmo.create({
            data: {
              nome: questao.nome,
              descricao: questao.descricao,
              script: questao.script,
              rankId: questao.rankId,
              ativo: true,
              status: questao.salvar
                ? req.admin
                  ? "Aprovado"
                  : "Pendente"
                : "Rascunho",
              usuarioId: req.userId,
            },
          });
          for (const erroLacuna of questao.errosLacuna) {
            const erroLacunaSalvo = await prisma.erroLacuna.create({
              data: {
                algoritmoId: algoritmo.id,
                tipo: erroLacuna.type === "error" ? "Erro" : "Lacuna",
                nivel: erroLacuna.nivel,
                posicaoInicial: erroLacuna.start,
                posicaoFinal: erroLacuna.end,
              },
            });
            for (const distrator of erroLacuna.distratores) {
              await prisma.distrator.create({
                data: {
                  erroLacunaId: erroLacunaSalvo.id,
                  descricao: distrator.text,
                },
              });
            }
          }
        }
      }
    });
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao cadastrar a atividade." });
  }
};
module.exports.listarAtividades = async (req, res) => {
  const { pesquisa, rascunhos, aprovadas, negadas, pendentes, minhas } =
    req.query;
  const whereObject = {
    nome: {
      contains: pesquisa,
      mode: "insensitive",
    },
  };
  whereObject.OR = [];
  if (aprovadas === "true") {
    whereObject.OR.push({ status: "Aprovado" });
  }
  if (negadas === "true") {
    whereObject.OR.push({ status: "Negado" });
  }
  if (pendentes === "true") {
    whereObject.OR.push({ status: "Pendente" });
  }
  if (rascunhos === "true") {
    whereObject.OR.push({ status: "Rascunho" });
  }
  if (minhas === "true") {
    whereObject.usuarioId = req.userId;
  }
  try {
    let algoritmos = await prisma.algoritmo.findMany({
      where: whereObject,
      select: { id: true, nome: true },
    });
    algoritmos = algoritmos.map((x) => ({ ...x, type: "codigo" }));
    let multiplaEscolhas = await prisma.multiplaEscolha.findMany({
      where: whereObject,
      select: { id: true, nome: true },
    });
    multiplaEscolhas = multiplaEscolhas.map((x) => ({
      ...x,
      type: "multiplaEscolha",
    }));
    const atividades = [...algoritmos, ...multiplaEscolhas];
    res.status(200).json(atividades);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao listar as atividades." });
  }
};
module.exports.listarRanks = async (req, res) => {
  try {
    const ranks = await prisma.rank.findMany();
    res.status(200).json(ranks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao listar os ranks." });
  }
};
