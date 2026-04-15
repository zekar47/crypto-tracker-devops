const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

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

app.listen(PORT, '0.0.0.0', () => {
    writeLog(`Servidor iniciado en puerto ${PORT}`);
});
