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
          if (!questao.novo) {
            const questaoSalva = await prisma.multiplaEscolha.findUnique({
              where: {
                id: questao.id,
              },
            });
            if (questaoSalva) {
              await prisma.multiplaEscolha.update({
                where: {
                  id: questao.id,
                },
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
                  status: questao.salvar
                    ? req.admin
                      ? "Aprovado"
                      : "Pendente"
                    : req.userId === questaoSalva.usuarioId
                      ? "Rascunho"
                      : "Negado",
                },
              });
            }
          } else {
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
          }
        } else if (questao.type === "codigo") {
          if (!questao.novo) {
            const questaoSalva = await prisma.algoritmo.findUnique({
              where: {
                id: questao.id,
              },
              include: {
                errosLacuna: {
                  include: {
                    distratores: true,
                  },
                },
              },
            });
            if (questaoSalva) {
              await prisma.algoritmo.update({
                where: {
                  id: questao.id,
                },
                data: {
                  nome: questao.nome,
                  descricao: questao.descricao,
                  script: questao.script,
                  rankId: questao.rankId,
                  status: questao.salvar
                    ? req.admin
                      ? "Aprovado"
                      : "Pendente"
                    : req.userId === questaoSalva.usuarioId
                      ? "Rascunho"
                      : "Negado",
                },
              });
              for (const erroLacuna of questaoSalva.errosLacuna) {
                const erroLacunaNova = questao.errosLacuna.find(
                  (x) => x.id === erroLacuna.id
                );
                if (!erroLacunaNova) {
                  await prisma.distrator.deleteMany({
                    where: {
                      erroLacunaId: erroLacuna.id,
                    },
                  });
                  await prisma.erroLacuna.delete({
                    where: {
                      id: erroLacuna.id,
                    },
                  });
                } else {
                  await prisma.erroLacuna.update({
                    where: {
                      id: erroLacuna.id,
                    },
                    data: {
                      posicaoFinal: erroLacunaNova.end,
                      posicaoInicial: erroLacunaNova.start,
                      nivel: erroLacunaNova.nivel,
                    },
                  });
                  for (const distrator of erroLacuna.distratores) {
                    const distratorNovo = erroLacunaNova.distratores.find(
                      (x) => x.id === distrator.id
                    );
                    if (!distratorNovo) {
                      await prisma.distrator.delete({
                        where: {
                          id: distrator.id,
                        },
                      });
                    } else {
                      await prisma.distrator.update({
                        where: {
                          id: distrator.id,
                        },
                        data: {
                          descricao: distratorNovo.text,
                        },
                      });
                    }
                  }
                  for (const distrator of erroLacunaNova.distratores) {
                    const distratorAntigo = erroLacuna.distratores.find(
                      (x) => x.id === distrator.id
                    );
                    if (!distratorAntigo) {
                      await prisma.distrator.create({
                        data: {
                          descricao: distrator.text,
                          erroLacunaId: erroLacuna.id,
                        },
                      });
                    }
                  }
                }
                for (const erroLacunaNova of questao.errosLacuna) {
                  const erroLacunaAntigo = questaoSalva.errosLacuna.find(
                    (x) => x.id === erroLacunaNova.id
                  );
                  if (!erroLacunaAntigo) {
                    const erroLacunaCriado = await prisma.erroLacuna.create({
                      data: {
                        algoritmoId: questaoSalva.id,
                        tipo:
                          erroLacunaNova.type === "error" ? "Erro" : "Lacuna",
                        nivel: erroLacunaNova.nivel,
                        posicaoInicial: erroLacunaNova.start,
                        posicaoFinal: erroLacunaNova.end,
                      },
                    });
                    for (const distrator of erroLacunaNova.distratores) {
                      await prisma.distrator.create({
                        data: {
                          descricao: distrator.text,
                          erroLacunaId: erroLacunaCriado.id,
                        },
                      });
                    }
                  }
                }
              }
            }
          } else {
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
module.exports.buscarAlgoritmo = async (req, res) => {
  const { id } = req.params;
  try {
    const algoritmo = await prisma.algoritmo.findUnique({
      where: { id: parseInt(id) },
      include: {
        errosLacuna: {
          include: {
            distratores: true,
          },
        },
      },
    });
    res.status(200).json(algoritmo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao buscar o algoritmo." });
  }
};
module.exports.buscarMultiplaEscolha = async (req, res) => {
  const { id } = req.params;
  try {
    const multiplaEscolha = await prisma.multiplaEscolha.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(multiplaEscolha);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Erro interno ao buscar a multipla escolha." });
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
