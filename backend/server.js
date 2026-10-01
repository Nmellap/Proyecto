const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3001;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'contigo',
  user: process.env.DB_USER || 'contigo',
  password: process.env.DB_PASSWORD || 'contigo_dev_only'
});
const namePattern = /^\p{L}[\p{L}\p{M}]*(?:[ '\u2019-]\p{L}[\p{L}\p{M}]*)*$/u;

app.use(cors());
app.use(express.json({ limit: '16kb' }));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola Contigo desde el backend' });
});

app.post('/api/contact', async (req, res) => {
  const { nombre, apellido, email, mensaje } = req.body || {};
  const firstName = typeof nombre === 'string' ? nombre.trim().normalize('NFC') : '';
  const lastName = typeof apellido === 'string' ? apellido.trim().normalize('NFC') : '';
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const message = mensaje == null ? null : typeof mensaje === 'string' ? mensaje.trim() || null : undefined;

  if (!namePattern.test(firstName) || firstName.length > 80) {
    return res.status(400).json({ message: 'Escribe un nombre válido usando solo letras.' });
  }
  if (!namePattern.test(lastName) || lastName.length > 80) {
    return res.status(400).json({ message: 'Escribe un apellido válido usando solo letras.' });
  }
  if (normalizedEmail.length > 254 || !validator.isEmail(normalizedEmail, { allow_utf8_local_part: true })) {
    return res.status(400).json({ message: 'Escribe un correo electrónico válido.' });
  }
  if (message === undefined || (message && message.length > 2000)) {
    return res.status(400).json({ message: 'El mensaje no puede superar los 2000 caracteres.' });
  }

  try {
    await pool.query(
      'INSERT INTO contact_messages (first_name, last_name, email, message) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, normalizedEmail, message]
    );
    return res.status(201).json({ message: 'Gracias. Recibimos tu mensaje.' });
  } catch (error) {
    console.error('Unable to save contact message:', error.message);
    return res.status(500).json({ message: 'No se pudo guardar el mensaje. Inténtalo más tarde.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGSERIAL PRIMARY KEY,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(254) NOT NULL,
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start backend:', error.message);
  process.exit(1);
});
