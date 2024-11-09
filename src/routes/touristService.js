const express = require('express');

const touristService = require('../models/touristService');

const router = express.Router();

// Ruta POST para crear un nuevo servicio turístico
router.post('/touristService', async (req, res) => {
    try {
        const newService = new touristService(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta GET para obtener todos los servicios turísticos, incluyendo la información del usuario
router.get('/touristService', async (req, res) => {
    try {
        const services = await touristService.find().populate('account_id');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta GET para obtener un servicio turístico por ID, incluyendo la información del usuario
router.get('/touristService/:id', async (req, res) => {
    try {
        const service = await touristService.findById(req.params.id).populate('account_id');
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;