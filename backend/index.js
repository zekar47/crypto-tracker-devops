const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/cryptodb';

mongoose.connect(mongoURI)
    .then(() => writeLog('Conectado a MongoDB exitosamente'))
    .catch(err => writeLog(`Error conectando a MongoDB: ${err}`, 'ERROR'));

const CryptoSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
    date: { type: Date, default: Date.now }
});
const Crypto = mongoose.model('Crypto', CryptoSchema);

app.use(cors());
app.use(express.json());

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }
const logFilePath = path.join(logDir, 'app.log');

const writeLog = (message, level = 'INFO') => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logEntry = `[${timestamp}] ${level}: ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.log(logEntry.trim());
};

app.get('/api/status', (req, res) => {
    writeLog('Consulta de estado realizada desde el navegador/cliente');
    res.json({ status: 'Backend Operativo', service: 'Crypto Tracker' });
});

app.post('/api/save', async (req, res) => {
    try {
        const newEntry = new Crypto(req.body);
        await newEntry.save();
        writeLog(`Dato guardado: ${req.body.symbol}`);
        res.json({ message: 'Guardado con éxito' });
    } catch (err) {
        writeLog('Error al guardar en DB', 'ERROR');
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    writeLog(`Servidor iniciado en puerto ${PORT}`);
});
