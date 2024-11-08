const mongoose = require('mongoose');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const docxPdf = require('docx-pdf');
const Account = require('./account');

const datosSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    nombres_apellidos: String,
    razon_social: String,
    ruc: String,
    domicilio_legal: String,
    departamento_provincia_distrito: String,
    representante_legal: String,
    documento_identidad_representante: String,
    nombre_comercial: String,
    direccion: String,
    departamento: String,
    provincia: String,
    distrito: String,
    telefonos: String,
    pagina_web: String,
    correo_electronico: String,
    redes_sociales: String,
    fecha_inicio_operaciones: String,
    licencia_funcionamiento: String,
    fecha_expedicion: String,
    infraestructura: String,
    equipamiento: String,
    personal_calificado: String,
    condiciones_digitales: String,
    modalidad_turismo: String,
    tipo_turismo: String,
    asociacion_turismo: String,
    calificacion_calidad: String,
    fecha: String,
    firma: String,
    nombres_apellidos_declarante: String,
    documento_identidad_declarante: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

// Verifica si la carpeta 'output' existe, si no, créala
const outputDir = path.resolve(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // Crea la carpeta de forma recursiva
}

// Middleware post-save to generate PDF
datosSchema.post('save', async function(doc) {
    try {
        // Load the docx template
        const content = fs.readFileSync(path.resolve(__dirname, 'template.docx'), 'binary');
        const zip = new PizZip(content);
        const docx = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Set the template variables
        docx.setData(doc.toObject());

        // Render the document
        docx.render();

        // Generate the docx file
        const buf = docx.getZip().generate({ type: 'nodebuffer' });

        // Save the docx file temporarily
        const tempDocxPath = path.resolve(outputDir, `${doc._id}.docx`);
        fs.writeFileSync(tempDocxPath, buf);

        // Convertir a PDF
        const tempPdfPath = path.resolve(outputDir, `${doc._id}.pdf`);
        docxPdf(tempDocxPath, tempPdfPath, (err, result) => {
            if (err) {
                console.error('Error converting docx to PDF:', err);
            } else {
                console.log(`PDF saved to ${tempPdfPath}`);
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
});

module.exports = mongoose.model('Datos', datosSchema);
