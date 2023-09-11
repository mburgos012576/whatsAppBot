const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    tipo: { type: String, required: true}, // A:admin | U : usuario 
    nombres: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    estado: { type: String, default: "A"} // A:activo | I:inactivo
},{
    versionKey: false
});

module.exports = mongoose.model("usuario", usuarioSchema);
