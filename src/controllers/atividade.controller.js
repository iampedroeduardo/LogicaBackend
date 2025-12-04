const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configura o multer para guardar os arquivos em memória (como Buffer)
// em vez de salvar diretamente no disco.
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Middleware para aceitar qualquer arquivo enviado no formulário.
// Os arquivos estarão em `req.files`.
module.exports.uploadImagens = upload.any();

module.exports.cadastrar = async (req, res) => {
  try {
    // Os dados chegam como string, então precisamos fazer o parse.
    const questoes = JSON.parse(req.body.questoes);
    const questoesIncorretas = questoes
      .map((window) => {
        if (
          (window.type === "multiplaEscolha" &&
            window.salvar &&
            (window.nome.trim().length === 0 ||
              window.pergunta.trim().length === 0 ||
              window.opcao1.trim().length === 0 ||
              window.opcao1.trim().length > 60 ||
              window.opcao2.trim().length === 0 ||
              window.opcao2.trim().length > 60 ||
              window.opcao3.trim().length === 0 ||
              window.opcao3.trim().length > 60 ||
              window.opcao4.trim().length === 0 ||
              window.opcao4.trim().length > 60 ||
              window.opcaoCorreta.length === 0 ||
              window.gabarito.trim().length === 0 ||
              (window.descricao.trim().length === 0 && !window.imagem) ||
              window.categoria.trim().length === 0 ||
              ((
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
          // Exemplo de como associar uma imagem à questão.
          // Supondo que o frontend envie o nome do campo da imagem (ex: 'imagem_0') na própria questão.
          const imagemAssociada = req.files.find(file => file.fieldname === questao.imagem);
          let caminhoImagem = null;

          // Se uma imagem foi encontrada, agora vamos salvá-la no disco.
          if (imagemAssociada) {
            const dir = "public/uploads/imagensDescricao/";
            // Garante que o diretório de destino exista
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            // Cria um nome de arquivo único
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const nomeArquivo = imagemAssociada.fieldname + "-" + uniqueSuffix + path.extname(imagemAssociada.originalname);
            caminhoImagem = path.join(dir, nomeArquivo);

            fs.writeFileSync(caminhoImagem, imagemAssociada.buffer);
          }
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
                  categoria: questao.categoria,
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
                      : "Negado", // Adicionar o campo da imagem aqui se for editar
                  foto: caminhoImagem,
                },
              });
            }
          } else {
            await prisma.multiplaEscolha.create({
              data: {
                nome: questao.nome,
                descricao: questao.descricao,
                rankId: questao.rankId,
                categoria: questao.categoria,
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
                foto: caminhoImagem, // Adicionar o campo da imagem aqui
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
            const rank = await prisma.rank.findUnique({
              where: { id: questao.rankId },
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
                  categoria: rank.categoria,
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
            const rank = await prisma.rank.findUnique({
              where: { id: questao.rankId },
            });
            const algoritmo = await prisma.algoritmo.create({
              data: {
                nome: questao.nome,
                descricao: questao.descricao,
                script: questao.script,
                rankId: questao.rankId,
                categoria: rank.categoria,
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
  const {
    pesquisa,
    rascunhos,
    aprovadas,
    negadas,
    pendentes,
    minhas,
    aprovadasFiltro,
    pendentesFiltro,
    negadasFiltro,
  } = req.query;
  const whereObject = {
    nome: {
      contains: pesquisa,
      mode: "insensitive",
    },
  };

  whereObject.OR = [];
  const filtroAtivo =
    aprovadasFiltro === "true" ||
    pendentesFiltro === "true" ||
    negadasFiltro === "true";
  //prioridade para filtro!
  if (filtroAtivo) {
    if (aprovadasFiltro === "true") {
      whereObject.OR.push({ status: "Aprovado" });
    }
    if (pendentesFiltro === "true") {
      whereObject.OR.push({ status: "Pendente" });
    }
    if (negadasFiltro === "true") {
      whereObject.OR.push({ status: "Negado" });
    }
  } else {
    if (aprovadas === "true") {
      whereObject.OR.push({ status: "Aprovado" });
    }
    if (negadas === "true") {
      whereObject.OR.push({ status: "Negado" });
    }
    if (pendentes === "true") {
      whereObject.OR.push({ status: "Pendente" });
    }
  }
  if (rascunhos === "true") {
    whereObject.OR.push({ status: "Rascunho" });
  }
  if (minhas === "true") {
    whereObject.usuarioId = req.userId;
  }
  if (whereObject.OR.length === 0) {
    delete whereObject.OR;
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
    const { rankId } = req.query;
    let where = {};

    // Se um rankId for fornecido
    if (rankId) {
      where.id = { lte: parseInt(rankId) }; //pega os anteriores a ele
    }
    const ranks = await prisma.rank.findMany({
      where: where,
      orderBy: { id: "asc" },
    });
    res.status(200).json(ranks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao listar os ranks." });
  }
};
module.exports.listarCategoriasRaciocinio = async (req, res) => {
  try {
    // Retorna todos os valores do enum 'Categoria'
    const todasAsCategorias = Object.values(conteudoRaciocinioLogico);
    res.status(200).json(todasAsCategorias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno ao listar as categorias." });
  }
};
module.exports.trilha = async (req, res) => {
  try {
    const { categoria, ...data } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        rank: true,
      },
    });

    if (!data.isPrimeiraQuestao) {
      const historicoAlgoritmoOntem =
        await prisma.historicoAlgoritmo.findFirst({
          where: {
            usuarioId: req.userId,
            data: {
              gt: new Date(new Date().setDate(new Date().getDate() - 1)),
              lt: new Date(),
            },
          },
        });
      const historicoMultiplaEscolhaOntem =
        await prisma.historicoMultiplaEscolha.findFirst({
          where: {
            usuarioId: req.userId,
            data:{
              gt: new Date(new Date().setDate(new Date().getDate() - 1)),
              lt: new Date(),
            }
          },
        });
      const historicoAlgoritmoHoje =
        await prisma.historicoAlgoritmo.findFirst({
          where: {
            usuarioId: req.userId,
            data: {
              gt: new Date(),
            },
          },
        });
      const historicoMultiplaEscolhaHoje =
        await prisma.historicoMultiplaEscolha.findFirst({
          where: {
            usuarioId: req.userId,
            data:{
              gt: new Date(),
            }
          },
        });
      if (historicoAlgoritmoOntem || historicoMultiplaEscolhaOntem && !historicoAlgoritmoHoje && !historicoMultiplaEscolhaHoje) {
        usuario.ofensiva++;
      }
      else if(!historicoAlgoritmoOntem && !historicoMultiplaEscolhaOntem && !historicoAlgoritmoHoje && !historicoMultiplaEscolhaHoje){
        usuario.ofensiva = 1;
      }
      if (usuario.ofensiva > usuario.recordeOfensiva){
        usuario.recordeOfensiva = usuario.ofensiva;
      }
      if (data.questao.tipo === "multiplaEscolha") {
        const historicoMultiplaEscolha =
          await prisma.historicoMultiplaEscolha.create({
            data: {
              usuarioId: req.userId,
              multiplaEscolhaId: data.questao.id,
              opcao: data.questao.opcao,
              data: new Date(),
            },
          });
      } else if (data.questao.tipo === "codigo") {
        const historicoAlgoritmo = await prisma.historicoAlgoritmo.create({
          data: {
            usuarioId: req.userId,
            algoritmoId: data.questao.id,
            tipo: data.questao.tipoErroLacuna,
            acertou: data.questao.acertou,
            data: new Date(),
          },
        });
        if (data.questao.tipoErroLacuna === "Lacuna") {
          for (const lacuna of data.questao.lacunas) {
            const historicoLacuna = await prisma.historicoErroLacuna.create({
              data: {
                historicoId: historicoAlgoritmo.id,
                erroLacunaId: lacuna.id,
              },
            });
          }
        } else if (data.questao.tipoErroLacuna === "Erro") {
          const historicoErro = await prisma.historicoErroLacuna.create({
            data: {
              historicoId: historicoAlgoritmo.id,
              erroLacunaId: data.questao.espacoErrado.id,
            },
          });
        }
      }
      let xp = 0;
      if (
        (data.questao.opcao === data.questao.opcaoCerta &&
          data.questao.tipo === "multiplaEscolha") ||
        (data.questao.acertou && data.questao.tipo === "codigo")
      ) {
        // acertou
        const xpPorNivel =
          data.questao.nivel === 0 ? 4 : data.questao.nivel === 1 ? 7 : 20;
        if (xpPorNivel === 4) {
          xp = xpPorNivel;
        } else {
          xp =
            xpPorNivel -
            xpPorNivel * 0.1 * (usuario.rankId - data.questao.rankId);
        }
      } else {
        // errou
        const xpPorNivel =
          data.questao.nivel === 0 ? -10 : data.questao.nivel === 1 ? -3 : -2;
        if (xpPorNivel === -10) {
          xp = xpPorNivel;
        } else {
          xp =
            xpPorNivel +
            xpPorNivel * 0.1 ** (usuario.rankId - data.questao.rankId);
        }
      }
      xp = xp.toFixed(1);
      xp = parseFloat(xp);
      let xpAtualizado = usuario.xp + xp;
      if (xpAtualizado >= 100 && usuario.nivel < 2) {
        usuario.nivel = usuario.nivel + 1;
        usuario.xp = xpAtualizado - 100;
      } else if (
        xpAtualizado >= 100 &&
        usuario.nivel === 2 &&
        usuario.tipo === "Programacao" &&
        usuario.rankId < 9
      ) {
        usuario.nivel = 0;
        usuario.rankId = usuario.rankId + 1;
        if (usuario.rankId === 2) {
          const novoUsuarioCor = await prisma.usuarioCores.createMany({
            data: [
              {
                usuarioId: usuario.id,
                cor: "Azul",
              },
              {
                usuarioId: usuario.id,
                cor: "Rosa",
              },
              {
                usuarioId: usuario.id,
                cor: "Amarelo",
              },
            ],
          });
        } else if (usuario.rankId === 3) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Bone",
          });
        } else if (usuario.rankId === 4) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Oculos",
          });
        } else if (usuario.rankId === 5) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Palhaco",
          });
        } else if (usuario.rankId === 6) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Squirtle",
          });
        } else if (usuario.rankId === 7) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Cartola",
          });
        } else if (usuario.rankId === 8) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Tiara",
          });
        } else if (usuario.rankId === 9) {
          const novoUsuarioAcessorio = await prisma.usuarioAcessorios.create({
            usuarioId: usuario.id,
            acessorio: "Coroa",
          });
        }
        usuario.xp = xpAtualizado - 100;
      } else if (xpAtualizado <= 0) {
        usuario.xp = 0;
      } else if (
        xpAtualizado >= 100 &&
        usuario.nivel === 2 &&
        ((usuario.tipo === "Programacao" && usuario.rankId === 9) ||
          usuario.tipo === "RaciocinioLogico")
      ) {
        usuario.xp = 100;
      } else {
        usuario.xp = xpAtualizado;
      }
      const atualizarUsuario = await prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          xp: usuario.xp,
          nivel: usuario.nivel,
          rankId: usuario.rankId,
          ofensiva: usuario.ofensiva,
          recordeOfensiva: usuario.recordeOfensiva,
        },
      });
    }
    if (!data.isUltimaQuestao) {
      const atividadesDisponiveis = [];
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      const historicoMultiplaEscolha =
        await prisma.historicoMultiplaEscolha.findMany({
          where: {
            usuarioId: req.userId,
            data: {
              gte: umMesAtras,
            },
          },
          select: {
            multiplaEscolhaId: true,
          },
        });
      if (usuario.rank.tipo === "Programacao") {
        const historicoAlgoritmos = await prisma.historicoAlgoritmo.findMany({
          where: {
            usuarioId: req.userId,
          },
          select: {
            algoritmoId: true,
          },
          orderBy: {
            data: "desc",
          },
          take: 10,
        });
        const algoritmos = await prisma.algoritmo.findMany({
          where: {
            rankId: {
              lte: usuario.rankId,
            },
            id: {
              notIn: historicoAlgoritmos.map((x) => x.algoritmoId),
            },
            ativo: true,
            status: "Aprovado",
            ...(categoria && {
              rank: { categoria: categoria },
            }),
          },
          include: {
            errosLacuna: {
              include: {
                distratores: true,
              },
            },
          },
        });
        for (const algoritmo of algoritmos) {
          algoritmo.espacosCertos = [
            ...algoritmo.errosLacuna.filter((x) => x.tipo === "Erro"),
          ];
          const historicos = await prisma.historicoAlgoritmo.findMany({
            where: {
              algoritmoId: algoritmo.id,
              usuarioId: req.userId,
            },
            include: {
              errosLacuna: true,
            },
          });
          algoritmo.espacosErrados = [
            ...algoritmo.errosLacuna.filter(
              (x) =>
                x.tipo === "Erro" &&
                historicos.filter(
                  (y) =>
                    y.tipo === "Erro" &&
                    y.errosLacuna.find((z) => x.id === z.erroLacunaId)
                ).length === 0
            ),
          ];
          algoritmo.lacunas = [
            ...algoritmo.errosLacuna.filter(
              (x) =>
                x.tipo === "Lacuna" &&
                historicos.filter(
                  (y) =>
                    y.tipo === "Lacuna" &&
                    y.errosLacuna.find((z) => x.id === z.erroLacunaId)
                ).length === 0
            ),
          ];
          if (
            algoritmo.espacosErrados.length > 0 ||
            algoritmo.lacunas.length > 1
          ) {
            atividadesDisponiveis.push({ ...algoritmo, type: "codigo" });
          }
        }
      }
      const multiplaEscolhas = await prisma.multiplaEscolha.findMany({
        where: {
          rankId: {
            lte: usuario.rankId,
          },
          id: {
            notIn: historicoMultiplaEscolha.map((x) => x.multiplaEscolhaId),
          },
          ativo: true,
          status: "Aprovado",
          ...(categoria && {
            categoria: categoria,
          }),
        },
      });
      atividadesDisponiveis.push(
        ...multiplaEscolhas.map((x) => ({ ...x, type: "multiplaEscolha" }))
      );
      if (atividadesDisponiveis.length === 0) {
        return res.status(200).json(null);
      }
      const ranksDisponiveis = [];
      for (const atividade of atividadesDisponiveis) {
        if (!ranksDisponiveis.includes(atividade.rankId)) {
          ranksDisponiveis.push(atividade.rankId);
        }
      }
      ranksDisponiveis.sort((a, b) => a - b);
      const probabilidades = [];
      for (let i = 0; i < ranksDisponiveis.length; i++) {
        for (let j = 0; j < 2 ** i; j++) {
          probabilidades.push(ranksDisponiveis[i]);
        }
      }
      const rankSorteado =
        probabilidades[Math.floor(Math.random() * probabilidades.length)];
      const atividadesFinais = atividadesDisponiveis.filter(
        (x) => x.rankId === rankSorteado
      );
      const atividadeSorteada =
        atividadesFinais[Math.floor(Math.random() * atividadesFinais.length)];
      if (atividadeSorteada.type === "multiplaEscolha") {
        const atividadeEnviada = {
          id: atividadeSorteada.id,
          nome: atividadeSorteada.nome,
          descricao: atividadeSorteada.descricao,
          foto: atividadeSorteada.foto,
          pergunta: atividadeSorteada.pergunta,
          gabarito: atividadeSorteada.gabarito,
          opcoes: ["", "", "", ""],
          opcaoCerta: null,
          tipo: "multiplaEscolha",
          rankId: atividadeSorteada.rankId,
          nivel: atividadeSorteada.nivel,
        };
        const possiveisPosicoes = [0, 1, 2, 3];
        let posicaoSorteada =
          possiveisPosicoes[
            Math.floor(Math.random() * possiveisPosicoes.length)
          ];
        possiveisPosicoes.splice(possiveisPosicoes.indexOf(posicaoSorteada), 1);
        atividadeEnviada.opcoes[posicaoSorteada] = atividadeSorteada.opcao1;
        atividadeEnviada.opcaoCerta = posicaoSorteada;
        posicaoSorteada =
          possiveisPosicoes[
            Math.floor(Math.random() * possiveisPosicoes.length)
          ];
        possiveisPosicoes.splice(possiveisPosicoes.indexOf(posicaoSorteada), 1);
        atividadeEnviada.opcoes[posicaoSorteada] = atividadeSorteada.opcao2;
        posicaoSorteada =
          possiveisPosicoes[
            Math.floor(Math.random() * possiveisPosicoes.length)
          ];
        possiveisPosicoes.splice(possiveisPosicoes.indexOf(posicaoSorteada), 1);
        atividadeEnviada.opcoes[posicaoSorteada] = atividadeSorteada.opcao3;
        atividadeEnviada.opcoes[possiveisPosicoes[0]] =
          atividadeSorteada.opcao4;
        res.status(200).json(atividadeEnviada);
      } else if (atividadeSorteada.type === "codigo") {
        const podeSerLacuna = atividadeSorteada.lacunas.length > 1;
        const podeSerErro = atividadeSorteada.espacosErrados.length > 0;
        if (podeSerLacuna && podeSerErro) {
          const sorteio = Math.floor(Math.random() * 2);
          if (sorteio === 0) {
            let espacoErradoSorteado =
              atividadeSorteada.espacosErrados[
                Math.floor(
                  Math.random() * atividadeSorteada.espacosErrados.length
                )
              ];
            const espacosCertosSorteados = atividadeSorteada.espacosCertos
              .filter((x) => x.id !== espacoErradoSorteado.id)
              .slice(0, Math.ceil(Math.random() * 3));
            espacoErradoSorteado.distrator =
              espacoErradoSorteado.distratores[
                Math.floor(
                  Math.random() * espacoErradoSorteado.distratores.length
                )
              ];
            const atividadeEnviada = {
              id: atividadeSorteada.id,
              nome: atividadeSorteada.nome,
              descricao: atividadeSorteada.descricao,
              script: atividadeSorteada.script,
              espacoErrado: espacoErradoSorteado,
              espacosCertos: espacosCertosSorteados,
              nivel: espacoErradoSorteado.nivel,
              tipo: "codigo",
              tipoErroLacuna: "Erro",
              rankId: atividadeSorteada.rankId,
            };
            res.status(200).json(atividadeEnviada);
          } else if (sorteio === 1) {
            const lacunas = atividadeSorteada.lacunas.slice(
              0,
              1 + Math.ceil(Math.random() * 3)
            );
            const nivelLacunaMaior = Math.max(...lacunas.map((x) => x.nivel));
            const atividadeEnviada = {
              id: atividadeSorteada.id,
              nome: atividadeSorteada.nome,
              descricao: atividadeSorteada.descricao,
              script: atividadeSorteada.script,
              lacunas: lacunas,
              nivel: nivelLacunaMaior,
              tipo: "codigo",
              tipoErroLacuna: "Lacuna",
              rankId: atividadeSorteada.rankId,
            };
            res.status(200).json(atividadeEnviada);
          }
        } else if (podeSerLacuna) {
          const lacunas = atividadeSorteada.lacunas.slice(
            0,
            1 + Math.ceil(Math.random() * 3)
          );
          const nivelLacunaMaior = Math.max(...lacunas.map((x) => x.nivel));
          const atividadeEnviada = {
            id: atividadeSorteada.id,
            nome: atividadeSorteada.nome,
            descricao: atividadeSorteada.descricao,
            script: atividadeSorteada.script,
            lacunas: lacunas,
            nivel: nivelLacunaMaior,
            tipo: "codigo",
            tipoErroLacuna: "Lacuna",
            rankId: atividadeSorteada.rankId,
          };
          res.status(200).json(atividadeEnviada);
        } else if (podeSerErro) {
          let espacoErradoSorteado =
            atividadeSorteada.espacosErrados[
              Math.floor(
                Math.random() * atividadeSorteada.espacosErrados.length
              )
            ];
          const espacosCertosSorteados = atividadeSorteada.espacosCertos
            .filter((x) => x.id !== espacoErradoSorteado.id)
            .slice(0, Math.ceil(Math.random() * 3));
          espacoErradoSorteado.distrator =
            espacoErradoSorteado.distratores[
              Math.floor(
                Math.random() * espacoErradoSorteado.distratores.length
              )
            ];
          const atividadeEnviada = {
            id: atividadeSorteada.id,
            nome: atividadeSorteada.nome,
            descricao: atividadeSorteada.descricao,
            script: atividadeSorteada.script,
            espacoErrado: espacoErradoSorteado,
            espacosCertos: espacosCertosSorteados,
            nivel: espacoErradoSorteado.nivel,
            tipo: "codigo",
            tipoErroLacuna: "Erro",
            rankId: atividadeSorteada.rankId,
          };
          res.status(200).json(atividadeEnviada);
        }
      }
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Erro interno ao gerar questão para trilha." });
  }
};
