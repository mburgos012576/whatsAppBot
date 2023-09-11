const express = require("express");
const router = express.Router();
const controlador = require("../controllers/chat.controller");

router.get("/listar", (req, res) => {
    controlador.listar(req, res);
});

router.post("/guardar", (req, res) => {
    controlador.guardar(req, res);
});

router.get("/detalle/:id", (req, res) => {
    controlador.buscarPorId(req, res);
});

router.put("/editar/:id", (req, res) => {
    controlador.editar(req, res);
});

router.delete("/eliminar/:id", (req, res) => {
    controlador.eliminar(req, res);
});

module.exports = router;
