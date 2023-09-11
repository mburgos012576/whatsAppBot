const jwt = require("jsonwebtoken");
const { TOKEN_KEY, TOKEN_EXPIRE } = require("../config");
const usuarioModel = require("../models/usuario.model");

const controlador = {
    async login(req, res){
        const { email, password } = req.body;
        try {
            const cliente = {
                email,
                password
            };
            const result = await usuarioModel.findOne(cliente);
            if(result){
                const payload = {
                    userId: result._id,
                    user: result.nombres,
                    email: result.email,
                	role: result.tipo   
                }
                console.log('payload => ',payload);
                const token = jwt.sign(
                    payload,
                    TOKEN_KEY,
                    { expiresIn: TOKEN_EXPIRE }
                );
                res.json({token});
            }else{
                res.status(401).send('Credenciales incorrectas');
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async listar(req, res){
        try {
            const result = await usuarioModel.find();
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async guardar(req, res){
        const { tipo, nombres, email, password } = req.body;
        const dato = new usuarioModel();
        dato.tipo = tipo;
        dato.nombres = nombres;
        dato.email = email;
        dato.password = password;
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
            const result = await usuarioModel.findById(id);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async editar(req, res){
        const { id } = req.params;
        const { tipo, nombres, email, password, estado  } = req.body;
        const datos = {
            tipo,
            nombres,
            email,
            password,
            estado
        };
        try {
            const result = await usuarioModel.findByIdAndUpdate(id, datos, {"new":true});
            res.json(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    async eliminar(req, res){
        try {
            const { id } = req.params;
            await usuarioModel.findByIdAndDelete(id);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
};

module.exports = controlador;
