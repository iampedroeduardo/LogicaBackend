const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, genero, nascimento, usuario, tipo, senha} = req.body;
        
        const senhaEncriptada = await bcrypt.hash(senha, 10);
        
        const novoUsuario = await prisma.usuario.create({
            data: { nome, email, genero, nascimento, usuario, tipo, senha: senhaEncriptada, adm: false}
        });
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};