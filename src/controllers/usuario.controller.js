const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, genero, dataNascimento, usuario, senha } = req.body;
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

module.exports.editar = async (req, res) => {
  try {
    const { id, nome, email, genero, dataNascimento, usuario } = req.body;
    const usuarioEditado = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        genero,
        nascimento: dataNascimento,
        usuario,
      },
    });
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { id },
      include: {
        rank: true,
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar dados do usuário." });
  }
};
