import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { mensajes } from "../libs/manejoErrores.js";
import { crearToken } from "../libs/jwt.js";
export async function register ({username, email, password}){
    try {
        const usuarioExistente = await User.findOne({username});
       
        if(usuarioExistente){
            return mensajes(400, "Usuario ya existente");
        }
        const emailExistente = await User.findOne({email});
        if(emailExistente){
            return mensajes(400, "Email ya existente");
        }
       
        const {hash, salt} = encriptarPassword(password);
    const data = new User({username, email, password:hash, salt});
   var respuesta= await data.save();
   const token=await crearToken({id:respuesta._id});
   return mensajes(200, "Registro agregado","",token);
    } catch (error) {
        return mensajes(400,"Error al registrar al usuarioS", error);
}
}

export const login = async ({username, password}) => {
    try {
        const usuarioCorrecto = await User.findOne({username});
        if(!usuarioCorrecto){
           
            return mensajes(400, "Datos incorrectos");
        }
        const passwordCorrecto = validarPassword(password, usuarioCorrecto.salt, usuarioCorrecto.password);
        if(!passwordCorrecto){
            
            return mensajes(400, "Datos incorrectos");
        }
        
        return mensajes(200, "Acceso Permitido");
    } catch (error) {
        
        return mensajes(400, "Datos incorrectos");
    }
}