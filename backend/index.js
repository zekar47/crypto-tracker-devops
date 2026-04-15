const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Asegurar que la carpeta de logs exista
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }

const logFilePath = path.join(logDir, 'app.log');

// Función para escribir logs
const writeLog = (message, level = 'INFO') => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logEntry = `[${timestamp}] ${level}: ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.log(logEntry.trim());
};

app.use(express.json());

// Endpoint de prueba (Tracker de Criptos)
app.get('/api/status', (req, res) => {
    writeLog('Consulta de estado realizada');
    res.json({ status: 'Backend Operativo', service: 'Crypto Tracker' });
});

app.listen(PORT, () => {
    writeLog(`Servidor iniciado en puerto ${PORT}`);
});
