const express = require('express');
const router = express.Router();
const usuarioRoute = require('../routes/usuario.route.js');
const atividadeRoute = require('../routes/atividade.route.js');


router.use(usuarioRoute);
router.use(atividadeRoute);

module.exports = router;
