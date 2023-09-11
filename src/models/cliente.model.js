const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    IdAsignacion: { type: String, required: true},
    IDCARTERA: { type: String, required: true},
    NombreCartera: { type: String, required: true},
    IdCliente: { type: String, required: true},
    NombreCliente: { type: String, required: true},
    DocumentoIdentidad: { type: String, required: true},
    IDEMPRESA: { type: String, required: true},
    TipoCartera: { type: String, required: true},
    TELEFONO: { type: String, required: true},
    deuda: { type: String, required: true},
    moneda: { type: String, required: true},
    campana: { type: String, required: true},
    monto_campana: { type: String, required: true},
    vencimiento: { type: String, required: true}
},{
    versionKey: false
});

module.exports = mongoose.model("cliente", clienteSchema);
