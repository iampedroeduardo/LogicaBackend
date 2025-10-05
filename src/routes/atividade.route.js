const express = require('express');
const route = express.Router();
const atividadeController = require('../controllers/atividade.controller');
const middleware = require('../middleware');

route.post('/atividades/cadastro', middleware, atividadeController.cadastrar)
route.get('/atividades/ranks', middleware, atividadeController.listarRanks)
route.get('/atividades/listar/:status', middleware, atividadeController.listarAtividades)

module.exports = route