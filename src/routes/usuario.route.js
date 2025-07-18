const express = require('express');
const route = express.Router();
const usuarioController = require('../controllers/usuario.controller')

route.post('/cadastro', usuarioController.cadastrar)
route.post('/entrar', usuarioController.entrar)
route.put('/editar', usuarioController.editar)

module.exports = route