const express = require('express');
const router = express.Router();
const path = require('path');
const Datos = require('../models/datos');
const Account = require('../models/account');

// Ruta POST para recibir los datos del formulario
router.post('/datos', async (req, res) => {
    try {
        // Obtén el account_id del cuerpo de la solicitud
        const { account_id, ...rest } = req.body;

        // Busca el documento de Account por ID
        const account = await Account.findById(account_id);

        if (!account) {
            return res.status(404).send('Account no encontrado');
        }

        // Crea un nuevo documento de Datos usando los campos del documento de Account
        const datos = new Datos({
            account_id,
            nombres_apellidos: account.nombre_completo,
            ruc: account.ruc,
            correo_electronico: account.email,
            documento_identidad_declarante: account.dni,
            representante_legal: account.nombre_completo,
            ...rest
        });

        await datos.save();
        res.status(201).send(datos);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Endpoint GET para obtener el archivo generado
router.get('/download/:id', (req, res) => {
    const { id } = req.params;
    const filePath = path.resolve(__dirname, `../output/${id}.docx`);

    // Verifica si el archivo existe
    if (fs.existsSync(filePath)) {
        res.download(filePath, `${id}.pdf`);  // Envia el archivo al cliente
    } else {
        res.status(404).send('Archivo no encontrado');
    }
});

module.exports = router;
