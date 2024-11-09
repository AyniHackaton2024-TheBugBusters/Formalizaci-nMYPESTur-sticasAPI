const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: [true, 'Full Name is required field!'],
    },
    ruc: {
        type: String,
        required: [true, 'RUC is required field!'],
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v);
            },
            message: props => `${props.value} no es un RUC valido. Debe tener 11 digitos numericos.`
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required field!'],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un correo electrónico válido.`
        }
    },
    dni: {
        type: String,
        required: [true, 'DNI is requires field!'],
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `${props.value} no es un DNI valido. Debe tener 8 digitos numericos.`
        }
    },
    clave_hash:{
        type: String,
        required: [true, 'Password is requires field!'],
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'Fecha de nacimiento es un campo requerido!']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', accountSchema);
