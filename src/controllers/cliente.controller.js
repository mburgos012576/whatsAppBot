const clienteModel = require("../models/cliente.model");

const controlador = {
    async listar(req, res) {
        try {
            const result = await clienteModel.find();
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async buscarPorDNI(req, res) {
        try {
            const { dni } = req.params;
            const result = await clienteModel.findOne({ "DocumentoIdentidad": dni });
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
};

module.exports = controlador;
