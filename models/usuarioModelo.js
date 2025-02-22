import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    tipoUsuario: {
        type: String,
        enum: ["usuario", "admin"],  // Solo puede ser "usuario" o "admin"
        default: "usuario",  // Valor por defecto si no se especifica
        required: true
    }
},
{
    timestamps: true  // Esto agrega las fechas de creación y actualización automáticamente
});

export default mongoose.model('User', usuariosSchema);
