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
    res.status(201).json(usuarioEditado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};
