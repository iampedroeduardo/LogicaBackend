const express = require('express');
const router = express.Router();
const usuarioRoute = require('../routes/usuario.route.js');

router.use(usuarioRoute);

module.exports = router;
