import { Router } from "express";
import { register, login } from "../db/usuariosBD.js";
import User from "../models/usuarioModelo.js";
import { mensajes } from "../libs/manejoErrores.js";
import bcrypt from "bcrypt";

const router = Router();

// Registro de usuarios
router.post("/registro", async (req, res) => {
    const { username, email, password, tipoUsuario = "usuario" } = req.body;

    // Asegurarse de que el tipo de usuario sea válido
    if (!["usuario", "admin"].includes(tipoUsuario)) {
        return res.status(400).json(mensajes(400, "Tipo de usuario no válido"));
    }

    // Encriptación de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const respuesta = await register({
        username,
        email,
        password: hashedPassword,  // Asegúrate de guardar la contraseña encriptada
        tipoUsuario
    });

    res.cookie('token', respuesta.token).status(respuesta.status).json(respuesta);
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    const respuesta = await login(req.body);
    res.status(respuesta.status).json(respuesta);
});

// Ruta para salir
router.get("/salir", async (req, res) => {
    res.send("Estas en Salir");
});

// Ruta para mostrar todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al obtener los usuarios", error));
    }
});

// Ruta para buscar un usuario por ID
router.get("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al buscar el usuario", error));
    }
});

// Ruta para borrar un usuario por ID
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findByIdAndDelete(id);

        if (!usuario) {
            return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        }

        res.status(200).json(mensajes(200, "Usuario borrado correctamente"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al borrar el usuario", error));
    }
});

// Ruta para actualizar un usuario por ID
router.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const usuario = await User.findByIdAndUpdate(id, datosActualizados, {
            new: true,
            runValidators: true
        });

        if (!usuario) {
            return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        }

        res.status(200).json(mensajes(200, "Usuario actualizado correctamente", usuario));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al actualizar el usuario", error));
    }
});

// Ruta para cambiar el tipo de usuario
router.put("/cambiar-tipo-usuario", async (req, res) => {
    try {
        const { userId, nuevoTipoUsuario } = req.body;

        // Verifica que el nuevo tipo de usuario sea válido
        if (!["usuario", "admin"].includes(nuevoTipoUsuario)) {
            return res.status(400).json(mensajes(400, "Tipo de usuario no válido"));
        }

        // Busca al usuario con el ID proporcionado
        const usuario = await User.findById(userId);

        if (!usuario) {
            return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        }

        // Cambia el tipo de usuario
        usuario.tipoUsuario = nuevoTipoUsuario;
        await usuario.save();

        // Responde con la confirmación de la actualización
        res.status(200).json({
            status: 200,
            message: "Tipo de usuario actualizado correctamente",
            data: usuario
        });

    } catch (error) {
        res.status(500).json(mensajes(500, "Error al cambiar el tipo de usuario", error));
    }
});

// Ruta para cambiar la contraseña (encriptada)
router.put("/cambiar-password/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevaPassword } = req.body;

        if (!nuevaPassword) {
            return res.status(400).json(mensajes(400, "La nueva contraseña es requerida"));
        }

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json(mensajes(404, "Usuario no encontrado"));
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaPassword, salt);
        await usuario.save();

        res.status(200).json(mensajes(200, "Contraseña actualizada correctamente"));
    } catch (error) {
        res.status(500).json(mensajes(500, "Error al cambiar la contraseña", error));
    }
});

export default router;
