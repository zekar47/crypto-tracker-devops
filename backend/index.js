const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/cryptodb';

// --- CONFIGURACIÓN DE RESILIENCIA ---
let isThrottled = false;
const THROTTLE_TIME = 60000; // 1 minuto de enfriamiento
const CACHE = new Map(); // Para no pedir la misma moneda 20 veces por segundo
const CACHE_DURATION = 30000; // 30 segundos de cache

// --- SISTEMA DE LOGS ---
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const writeLog = (msg, level = 'INFO') => {
    const entry = `[${new Date().toISOString().split('.')[0]}] ${level}: ${msg}\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), entry);
    console.log(entry.trim());
};

// --- CONEXIÓN A DB ---
mongoose.connect(MONGO_URI)
    .then(() => writeLog('Conexión estable con MongoDB'))
    .catch(err => writeLog(`Fallo crítico en DB: ${err.message}`, 'ERROR'));

const Crypto = mongoose.model('Crypto', new mongoose.Schema({
    symbol: { type: String, uppercase: true, required: true },
    price: Number,
    timestamp: { type: Date, default: Date.now }
}));

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- RUTAS ---

// Health Check
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', db: mongoose.connection.readyState === 1 });
});

// Historial (Máximo 15 registros)
app.get('/api/history', async (req, res) => {
    try {
        const data = await Crypto.find().sort({ timestamp: -1 }).limit(15);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al leer DB' });
    }
});

// Tracker con Lógica de Protección
app.post('/api/track', async (req, res) => {
    const { coin } = req.body;
    if (!coin) return res.status(400).json({ error: 'Falta nombre de moneda' });

    const coinId = coin.toLowerCase();

    // 1. Verificar Enfriamiento
    if (isThrottled) {
        return res.status(429).json({ error: 'Sistema en modo enfriamiento. API externa saturada.' });
    }

    // 2. Verificar Cache (Para ahorrar llamadas a la API)
    if (CACHE.has(coinId) && (Date.now() - CACHE.get(coinId).time < CACHE_DURATION)) {
        writeLog(`Cache hit: ${coinId}`);
        return res.json(CACHE.get(coinId).data);
    }

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
            { timeout: 5000 }
        );

        if (!response.data[coinId]) {
            return res.status(404).json({ error: 'Moneda no encontrada' });
        }

        const price = response.data[coinId].usd;
        const record = new Crypto({ symbol: coinId, price });
        await record.save();

        // Actualizar Cache
        CACHE.set(coinId, { data: record, time: Date.now() });

        writeLog(`Registro guardado: ${coinId} ($${price})`);
        res.json(record);

    } catch (err) {
        if (err.response?.status === 429) {
            isThrottled = true;
            writeLog('RATE LIMIT DETECTADO. Activando Circuit Breaker.', 'WARN');
            setTimeout(() => { isThrottled = false; writeLog('Circuit Breaker desactivado.'); }, THROTTLE_TIME);
            return res.status(429).json({ error: 'Demasiadas peticiones. Reintentando en 1min.' });
        }
        
        writeLog(`Error en tracking: ${err.message}`, 'ERROR');
        res.status(500).json({ error: 'Error al contactar API externa' });
    }
});

app.listen(PORT, '0.0.0.0', () => writeLog(`Servidor listo en puerto ${PORT}`));
