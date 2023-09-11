const chatModel = require("../models/chat.model");

const controlador = {
    async listar(req, res){
        try {
            const result = await chatModel.find();
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async guardar(req, res){
        const { nombres, from, to , chat } = req.body;
        const dato = new chatModel();
        dato.nombres = nombres;
	dato.from = from;
	dato.to = to;
	dato.chat = chat;
        try {
            const result = await dato.save();
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async buscarPorId(req, res){
        try {
            const { id } = req.params;
            const result = await chatModel.findById(id);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async editar(req, res){
        const { id } = req.params;
        const { nombres, from, to, chat } = req.body;
        const datos = {
            nombres,
            from,
	    to,
	    chat,
        };
        try {
            const result = await chatModel.findByIdAndUpdate(id, datos, {"new":true});
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async eliminar(req, res){
        try {
            const { id } = req.params;
            await chatModel.findByIdAndDelete(id);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
};

module.exports = controlador;

