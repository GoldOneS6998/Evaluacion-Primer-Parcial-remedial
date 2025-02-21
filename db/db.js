import mongoose from "mongoose";
import { mensajes } from "../libs/manejoErrores.js";
export async function conectarBD() {
    try {
        const respuesta=await mongoose.connect("mongodb://127.0.0.1:27017/appMongo");
        return mensajes(200,"Conexion a la BD Ok");
    } catch (error) {
        //console.log(error);
        return mansajes(400,"Error",error);
    }
}
