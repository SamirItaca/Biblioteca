const express = require('express');
const router = express.Router();
const pool = require('../db'); // conexión a PostgreSQL

// REGISTRARSE
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si existe
        const existing = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1 OR email = $2',
            [username, email]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Usuario ya registrado' });
        }

        // Insertar usuario
        const result = await pool.query(
            'INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );

        res.status(201).json({ message: 'Usuario registrado', usuario: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// INICIAR SESIÓN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {

        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.json({ message: 'Inicio de sesión correcto', usuario: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// OBTENER UN USUARIO
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;