import { Router } from "express";
import { register, login } from "../db/usuariosBD.js";
import User from "../models/usuarioModelo.js";
import { mensajes } from "../libs/manejoErrores.js";

const router = Router();

// Crear nuevo usuario
router.post("/registro", async (req, res) => {
    try {
        const resultado = await register(req.body);
        res.cookie('token', resultado.token).status(resultado.status).json(resultado);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error en el registro", error));
    }
});

// Autenticación de usuario
router.post("/login", async (req, res) => {
    try {
        const resultado = await login(req.body);
        res.status(resultado.status).json(resultado);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error en el inicio de sesión", error));
    }
});

// Cierre de sesión
router.get("/salir", (req, res) => {
    res.send("Sesión cerrada");
});

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const listaUsuarios = await User.find();
        res.status(200).json(listaUsuarios);
    } catch (error) {
        res.status(500).json(mensajes(500, "No se pudieron recuperar los usuarios", error));
    }
});

// Buscar usuario por ID
router.get("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al buscar usuario", error));
    }
});

// Eliminar usuario por ID
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(mensajes(200, "Usuario eliminado con éxito"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al eliminar usuario", error));
    }
});

// Modificar usuario por ID
router.put("/usuarios/:id", async (req, res) => {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!usuarioActualizado) return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        res.status(200).json(mensajes(200, "Usuario actualizado correctamente", usuarioActualizado));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al actualizar usuario", error));
    }
});

// Administradores (pendiente de implementación)
router.get("/administradores", (req, res) => {
    res.send("Sección de administradores");
});

// Usuarios casuales (pendiente de implementación)
router.get("/casuales", (req, res) => {
    res.send("Sección de usuarios casuales");
});

export default router;
