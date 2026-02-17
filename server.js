const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CONFIG
app.use(cors());
app.use(express.json());
// FIN CONFIG

// PAGINAS
const path = require('path');

// Servir archivos estáticos (css, js, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Carpeta pages
const DIR_PAGES = path.join(__dirname, 'public/pages');

// Página principal → login
app.get('/', (req, res) => {
    res.sendFile(path.join(DIR_PAGES, 'login.html'));
});

app.get('/:page', (req, res) => {
    const file = path.join(DIR_PAGES, req.params.page + '.html');
    res.sendFile(file);
});
// FIN PAGINAS

// ENDPOINTS
app.use('/api/books', require('./routes/books'));

// FIN ENDPOINT

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running in port: " + PORT));