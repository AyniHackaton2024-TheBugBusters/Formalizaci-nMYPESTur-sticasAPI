const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Account = require('../models/account'); // Correct import

const router = express.Router();

router.post('/create-account', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedDNI = await bcrypt.hash(req.body.dni, salt);

        const account = new Account({
            ...req.body,
            dni: hashedDNI,  // Hasheamos el DNI y lo guardamos en el campo dni
            clave_hash: hashedDNI,  // Guardamos el hash del DNI en clave_hash
            fecha_nacimiento: req.body.fecha_nacimiento // El formato debe ser YYYY-MM-DD
        });

        const newAccount = await account.save();

        // Exclude the 'clave_hash' field from the response
        const { clave_hash, ...accountData } = newAccount.toObject();

        res.json(accountData);
    } catch(error){
        if (error.name == 'ValidationError') {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        const { ruc, dni } = req.body;

        const account = await Account.findOne({ ruc });
        if (!account) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Verifica que DNI y clave_hash estén presentes antes de continuar
        if (!dni || !account.clave_hash) {
            return res.status(400).send('DNI o clave_hash no proporcionado');
        }

        // Comparar DNI proporcionado con el hash almacenado en clave_hash
        const isMatch = await bcrypt.compare(dni, account.clave_hash);
        if (!isMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Generar y enviar token JWT si la comparación es exitosa
        const token = jwt.sign({ id: account._id }, 'banbifBDTok$nPa$%', { expiresIn: '1h' });

        res.send({ token, userId: account._id, userName: account.nombre_completo });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
