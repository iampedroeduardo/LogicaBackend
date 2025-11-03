const express = require('express');
const route = express.Router();
const atividadeController = require('../controllers/atividade.controller');
const middleware = require('../middleware');

route.post('/atividades/cadastro', middleware, atividadeController.cadastrar)
route.get('/atividades/ranks', middleware, atividadeController.listarRanks)
route.get('/atividades/categorias-raciocinio', middleware, atividadeController.listarCategoriasRaciocinio)
route.get('/atividades/listar', middleware, atividadeController.listarAtividades)
route.get('/atividades/algoritmo/:id', middleware, atividadeController.buscarAlgoritmo)
route.get('/atividades/multiplaEscolha/:id', middleware, atividadeController.buscarMultiplaEscolha)
route.post('/atividades/trilha', middleware, atividadeController.trilha)

module.exports = route