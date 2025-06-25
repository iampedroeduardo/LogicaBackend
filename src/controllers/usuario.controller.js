const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports.cadastrar = async (req, res) => {
  try {
    const { nome, sobrenome, email, genero, dataNascimento, usuario, senha } =
      req.body;
    const nomeCompleto = nome + " " + sobrenome;
    const senhaEncriptada = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: nomeCompleto,
        email,
        genero,
        nascimento: dataNascimento,
        usuario,
        senha: senhaEncriptada,
        adm: false,
      },
    });
    const payload = {
      id: novoUsuario.id,
      email: novoUsuario.email,
      admin: novoUsuario.adm,
    };
    const token = jwt.sign(payload, secret);
    const usuarioEditado = await prisma.usuario.update({
      where: { id: novoUsuario.id },
      data: { token },
    });
    res
      .status(201)
      .json({
        nome: usuarioEditado.nome,
        adm: usuarioEditado.adm,
        token: usuarioEditado.token,
        id: usuarioEditado.id,
        email: usuarioEditado.email,
        usuario: usuarioEditado.usuario,
        usuario: usuarioEditado.genero,
        nascimento: usuarioEditado.nascimento,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

module.exports.entrar = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { OR: [{ usuario: usuario }, { email: usuario }] },
    });
    if (usuarioEncontrado) {
      const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
      if (senhaCorreta) {
        // const payload = { id: usuarioEncontrado.id, email: usuarioEncontrado.email, admin: usuarioEncontrado.adm };
        // const token = jwt.sign(payload, secret) terminar do jwt???
        res.status(200).json({
          nome: usuarioEncontrado.nome,
          adm: usuarioEncontrado.adm,
          token: usuarioEncontrado.token,
          id: usuarioEncontrado.id,
          email: usuarioEncontrado.email,
          usuario: usuarioEncontrado.usuario,
          usuario: usuarioEncontrado.genero,
          nascimento: usuarioEncontrado.nascimento,
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
