const express = require("express");
const router = express.Router();
const controlador = require("../controllers/cliente.controller");

router.get("/listar", (req, res) => {
    controlador.listar(req, res);
});

router.get("/detalle/:dni", (req, res) => {
    controlador.buscarPorDNI(req, res);
});

module.exports = router;
