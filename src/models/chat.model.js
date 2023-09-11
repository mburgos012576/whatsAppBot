const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    nombres: { type: String, required: true },
    from: { type: String, required: true },
    to: {type: String, required: true },
    fecha: { type: Date, default: Date.now },
    chat: { type: String, required: true }
},{
    versionKey: false
});

module.exports = mongoose.model("chat", chatSchema);

