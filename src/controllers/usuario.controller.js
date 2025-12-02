const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, genero, dataNascimento, usuario, senha } = req.body;

    // Validations
    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({ error: "O nome deve ter pelo menos 3 caracteres." });
    }

    if (!usuario || usuario.trim().length < 3) {
      return res.status(400).json({ error: "O usuário deve ter pelo menos 3 caracteres." });
    }

    if (!email || !email.includes("@") || email.trim().length < 10) {
      return res.status(400).json({ error: "E-mail inválido." });
    }

    if (!dataNascimento) {
      return res.status(400).json({ error: "Data de nascimento é obrigatória." });
    }

    const dataNasc = new Date(dataNascimento);
    const ano = dataNasc.getFullYear();
    const mes = dataNasc.getMonth() + 1;
    const dia = dataNasc.getDate();

    if (
      isNaN(dataNasc.getTime()) ||
      ano < 1900 ||
      ano > new Date().getFullYear() ||
      mes < 1 ||
      mes > 12 ||
      dia < 1 ||
      dia > 31 ||
      ([4, 6, 9, 11].includes(mes) && dia > 30) ||
      (mes === 2 && dia > 29)
    ) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    if (genero == null) {
      return res.status(400).json({ error: "Gênero é obrigatório." });
    }

    if (
      !senha ||
      !senha.match(/[0-9]/g) ||
      !senha.match(/[A-Z]/g) ||
      !senha.match(/[a-z]/g) ||
      !senha.match(/[\W|_]/g) ||
      senha.length < 8
    ) {
      return res.status(400).json({ error: "A senha não atende aos requisitos mínimos de segurança." });
    }

    const senhaEncriptada = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        genero,
        nascimento: dataNascimento,
        usuario,
        senha: senhaEncriptada,
        adm: false,
        cor: "Preto",
        acessorio: "None",
        rankId: 1,
        nivel: 0,
      },
    });
    const usuarioCor = await prisma.usuarioCores.create({
      data: {
        usuarioId: novoUsuario.id,
        cor: novoUsuario.cor,
      },
    })
    const usuarioAcessorio = await prisma.usuarioAcessorios.create({
      data: {
        usuarioId: novoUsuario.id,
        acessorio: novoUsuario.acessorio,
      },
    })
    const payload = {
      id: novoUsuario.id,
      admin: novoUsuario.adm,
    };
    const token = jwt.sign(payload, secret);
    const usuarioEditado = await prisma.usuario.update({
      where: { id: novoUsuario.id },
      data: { token },
    });
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { id: novoUsuario.id },
      include: {
        rank: true,
        cores: true,
        acessorios: true,
      },
    });
    const proximoRank = await prisma.rank.findFirst({
      where: { id: usuarioEncontrado.rankId + 1 },
    });
    res.status(201).json({
      nome: usuarioEncontrado.nome,
      adm: usuarioEncontrado.adm,
      token: usuarioEncontrado.token,
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      usuario: usuarioEncontrado.usuario,
      genero: usuarioEncontrado.genero,
      nascimento: usuarioEncontrado.nascimento,
      cor: usuarioEncontrado.cor,
      acessorio: usuarioEncontrado.acessorio,
      rank: usuarioEncontrado.rank,
      nivel: usuarioEncontrado.nivel,
      proximoRank: proximoRank,
      xp: usuarioEncontrado.xp,
      cores: usuarioEncontrado.cores,
      acessorios: usuarioEncontrado.acessorios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

module.exports.editar = async (req, res) => {
  try {
    const { id, nome, email, genero, dataNascimento, usuario, cor, acessorio } = req.body;
    const usuarioEditado = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        genero,
        nascimento: dataNascimento,
        usuario,
        cor,
        acessorio,
      },
    });
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { id },
      include: {
        rank: true,
        cores: true,
        acessorios: true,
      },
    });
    const proximoRank = await prisma.rank.findFirst({
      where: { id: usuarioEncontrado.rankId + 1 },
    });
    res.status(201).json({
      nome: usuarioEncontrado.nome,
      adm: usuarioEncontrado.adm,
      token: usuarioEncontrado.token,
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      usuario: usuarioEncontrado.usuario,
      genero: usuarioEncontrado.genero,
      nascimento: usuarioEncontrado.nascimento,
      cor: usuarioEncontrado.cor,
      acessorio: usuarioEncontrado.acessorio,
      rank: usuarioEncontrado.rank,
      nivel: usuarioEncontrado.nivel,
      proximoRank: proximoRank,
      xp: usuarioEncontrado.xp,
      cores: usuarioEncontrado.cores,
      acessorios: usuarioEncontrado.acessorios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao editar usuário." });
  }
};

module.exports.entrar = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { OR: [{ usuario: usuario }, { email: usuario }] },
      include: {
        rank: true,
        cores: true,
        acessorios: true,
      },
    });
    if (usuarioEncontrado) {
      const proximoRank = await prisma.rank.findFirst({
        where: { id: usuarioEncontrado.rankId + 1 },
      });
      const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
      if (senhaCorreta) {
        const payload = {
          id: usuarioEncontrado.id,
          admin: usuarioEncontrado.adm,
        };
        const token = jwt.sign(payload, secret);
        const usuarioEditado = await prisma.usuario.update({
          where: { id: usuarioEncontrado.id },
          data: { token },
        });
        res.status(200).json({
          nome: usuarioEncontrado.nome,
          adm: usuarioEncontrado.adm,
          token: token,
          id: usuarioEncontrado.id,
          email: usuarioEncontrado.email,
          usuario: usuarioEncontrado.usuario,
          genero: usuarioEncontrado.genero,
          nascimento: usuarioEncontrado.nascimento,
          cor: usuarioEncontrado.cor,
          acessorio: usuarioEncontrado.acessorio,
          rank: usuarioEncontrado.rank,
          proximoRank: proximoRank,
          nivel: usuarioEncontrado.nivel,
          xp: usuarioEncontrado.xp,
          cores: usuarioEncontrado.cores,
          acessorios: usuarioEncontrado.acessorios,
        });
      } else {
        res.status(401).json({ error: "senha" });
      }
    } else {
      res.status(401).json({ error: "usuario" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.atualizarDados = async (req, res) => {
  try {
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { id: req.userId },
      include: {
        rank: true,
        cores: true,
        acessorios: true,
      },
    });
    const proximoRank = await prisma.rank.findFirst({
      where: { id: usuarioEncontrado.rankId + 1 },
    });
    res.status(200).json({
      nome: usuarioEncontrado.nome,
      adm: usuarioEncontrado.adm,
      token: usuarioEncontrado.token,
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      usuario: usuarioEncontrado.usuario,
      genero: usuarioEncontrado.genero,
      nascimento: usuarioEncontrado.nascimento,
      cor: usuarioEncontrado.cor,
      acessorio: usuarioEncontrado.acessorio,
      rank: usuarioEncontrado.rank,
      proximoRank: proximoRank,
      nivel: usuarioEncontrado.nivel,
      xp: usuarioEncontrado.xp,
      cores: usuarioEncontrado.cores,
      acessorios: usuarioEncontrado.acessorios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar dados do usuário." });
  }
};

module.exports.ranking = async (req, res) => {
  try {
    const { cursor, acima, abaixo } = req.params;
    const ranking = await prisma.$queryRawUnsafe(`
      WITH ranking AS (SELECT u."id" as id, u."usuario" as usuario, u."xp" as xp, u."rankId" as rankId, u."nivel" as nivel, r."nome" as rankNome, r."cor" as rankCor, ROW_NUMBER() OVER (ORDER BY u."rankId" DESC, u."nivel" DESC, u."xp" DESC) AS posicao from "Usuario" AS u LEFT JOIN "Rank" AS r ON u."rankId" = r."id") SELECT * FROM ranking WHERE posicao BETWEEN (SELECT posicao - ${acima} FROM ranking where id = ${cursor}) AND (SELECT posicao + ${abaixo} FROM ranking where id = ${cursor})
    `);
    // JSON.stringify não consegue serializar BigInt, então precisamos convertê-lo.
    const rankingComBigIntConvertido = ranking.map((item) => ({
      ...item,
      posicao: item.posicao.toString(),
    }));
    res.status(200).json(rankingComBigIntConvertido);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar ranking." });
  }
};

module.exports.ofensiva = async (req, res) => {
  try{
    const usuario = await prisma.usuario.findFirst({
      where: { id: req.userId },
    });
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
      if (!historicoAlgoritmoOntem && !historicoMultiplaEscolhaOntem && !historicoAlgoritmoHoje && !historicoMultiplaEscolhaHoje) {
        usuario.ofensiva = 0;
        await prisma.usuario.update({
          where: { id: req.userId },
          data: { ofensiva: 0 },
        });
      }
      res.status(200).json({ ofensiva: usuario.ofensiva, recordeOfensiva: usuario.recordeOfensiva })
  }catch(error){
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar ofensiva." });
  }
}
