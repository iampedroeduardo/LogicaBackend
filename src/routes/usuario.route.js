const express = require('express');
const route = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const middleware = require('../middleware');

route.post('/cadastro', usuarioController.cadastrar)
route.post('/entrar', usuarioController.entrar)
route.put('/editar', usuarioController.editar)
route.get('/atualizar-dados', middleware, usuarioController.atualizarDados)

module.exports = route