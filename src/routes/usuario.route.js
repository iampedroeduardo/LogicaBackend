const express = require('express');
const route = express.Router();
const usuarioController = require('../controllers/usuario.controller')

route.post('/cadastro', usuarioController.cadastrar)

module.exports = route