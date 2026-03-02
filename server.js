// Importo las dependecias que voy a usar
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const mysql = require('mysql2/promise');
const fs = require('fs');

const { MongoClient } = require('mongodb');

const { create } = require('domain');

// mongodb://read:scORHWprCvp26Gz1zwPQgSsokHyPC2@157.180.40.190:27017/db_andrescortes
// URI de conexión a MongoDB local
const uri = process.env.DB_MONGO;

// Crea una nueva instancia del cliente de Mongo
const client = new MongoClient(uri);

const app = express();

// Configura Multer para guardar archivos subidos en la carpeta uploads/
const upload = multer({ dest: 'uploads/' });

// Creo un pool de conexiones a MySQL 
const db = mysql.createPool({
    host: process.env.DB_HOST,             // servidor MySQL
    user: process.env.DB_USER,             // usuario
    password: process.env.DB_PASSWORD,     // contraseña
    database: process.env.DB_NAME,         // base de datos
    waitForConnections: true,              // si no hay conexiones, esperar
    connectionLimit: 40,                   // máximo de conexiones simultáneas
    queueLimit: 0                          
});


// Función para probar la conexión a MySQL
async function connectMysql() {
    try {
        // Intenta obtener una conexión del pool
        const connection = await db.getConnection();
        console.log('Conectado a MySQL');
        // Libera la conexión para que pueda ser reutilizada
        connection.release();

    } catch (error) {
        console.error('Error al conectar a MySQL:', error);
        // Termina el proceso si falla la conexión
        process.exit(1);
    }
}

// Ejecuta la función para verificar la conexión
connectMysql();

// Variable que almacenará la colección de logs
let logsCollection;

// Función para conectarse a MongoDB
async function connectDB() {
    try {
        // Conecta el cliente a MongoDB
        await client.connect();

        console.log('Conectado a MongoDB');

        // Selecciona la base de datos llamada app
        const db = client.db('app');

        // Selecciona la colección llamada logs
        logsCollection = db.collection('logs');

        console.log('logs creado');

    } catch (error) {
        // Muestra error si falla la conexión
        console.log(error);
    }
}

// Ejecuta la conexión a MongoDB
connectDB();

// Función para guardar un log en MongoDB
async function saveLog(action) {
    try {
        // Inserta un documento con la acción y fecha actual
        await logsCollection.insertOne({
            action,
            created_at: new Date()
        });

        console.log(`log ${action} agregado`);
        
    } catch (error) {
        console.log('error en saveLog');
    }
}

// 1. Endpoint para subir archivo CSV de categories

app.post('/api/upload/categories', upload.single('archivo'), (req, res) => {

    // Arreglo donde se guardarán las filas del CSV
    const rows = [];

    // Lee el archivo subido desde el sistema de archivos
    fs.createReadStream(req.file.path)

        // Pasa el contenido al parser CSV
        .pipe(parse({ columns: true, trim: true }))

        // Por cada fila leída la agrega al arreglo rows
        .on('data', row => rows.push(row))

        // Cuando termina de leer el archivo
        .on('end', async () => {
            try {

                // Si existen filas en el CSV
                if (rows.length) {

                    // Construye una cadena con los valores para el INSERT
                    const values = rows
                        .map(r => `('${r.id_category}','${r.name}')`)
                        .join(',');

                    // Ejecuta el INSERT masivo en la tabla cargos
                    await db.query(`INSERT INTO categories (id_category, name) VALUES ${values}`);

                    // Guarda un log en MongoDB
                    saveLog('INSERT INTO categories');
                }

                // Responde con éxito y total de registros insertados
                res.json({ ok: true, total: rows.length });

            } catch (error) {
                // Si ocurre error, responde con estado 500
                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// 2. Endpoint para subir archivo CSV de suppliers
app.post('/api/upload/suppliers', upload.single('archivo'), (req, res) => {

    const rows = [];

    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {

                if (rows.length) {

                    // Construye valores para INSERT
                    const values = rows
                        .map(r => `('${r.id_supplier}','${r.name}','${r.email}')`)
                        .join(',');

                    // Ejecuta INSERT masivo en tabla autores
                    await db.query(`INSERT INTO suppliers (id_supplier, name, email) VALUES ${values}`);

                    // Guarda log en Mongo
                    saveLog('INSERT INTO suppliers');
                }

                // Devuelve respuesta exitosa
                res.json({ ok: true, total: rows.length });

            } catch (error) {
                console.log(error);

                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// 3. Endpoint para subir archivo CSV de customers
app.post('/api/upload/customers', upload.single('archivo'), (req, res) => {

    const rows = [];

    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {

                if (rows.length) {

                    // Construye valores para INSERT
                    const values = rows
                        .map(r => `('${r.id_customer}','${r.name}','${r.email}','${r.address}','${r.phone}')`)
                        .join(',');

                    // Ejecuta INSERT masivo en tabla autores
                    await db.query(`INSERT INTO customers (id_customer, name, email, address, phone) VALUES ${values}`);

                    // Guarda log en Mongo
                    saveLog('INSERT INTO customers');
                }

                // Devuelve respuesta exitosa
                res.json({ ok: true, total: rows.length });

            } catch (error) {
                console.log(error);

                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// 4. Endpoint para subir archivo CSV de products
app.post('/api/upload/products', upload.single('archivo'), (req, res) => {

    const rows = [];

    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {

                if (rows.length) {

                    // Construye valores para INSERT
                    const values = rows
                        .map(r => `('${r.id_product}','${r.product_sku}','${r.name}','${r.unit_price}','${r.id_category}','${r.id_supplier}')`)
                        .join(',');

                    // Ejecuta INSERT masivo en tabla autores
                    await db.query(`INSERT INTO products (id_product, product_sku, name, unit_price, id_category, id_supplier) VALUES ${values}`);

                    // Guarda log en Mongo
                    saveLog('INSERT INTO products');
                }

                // Devuelve respuesta exitosa
                res.json({ ok: true, total: rows.length });

            } catch (error) {
                console.log(error);

                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// 5. Endpoint para subir archivo CSV de transactions
app.post('/api/upload/transactions', upload.single('archivo'), (req, res) => {

    const rows = [];

    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {

                if (rows.length) {

                    // Construye valores para INSERT
                    const values = rows
                        .map(r => `('${r.id_transaction}','${r.date}','${r.quantity}','${r.total_line_value}','${r.id_costomer}','${r.id_product}')`)
                        .join(',');

                    // Ejecuta INSERT masivo en tabla autores
                    await db.query(`INSERT INTO transactions (id_transaction, date, quantity, total_line_value, id_costomer, id_product) VALUES ${values}`);

                    // Guarda log en Mongo
                    saveLog('INSERT INTO transactions');
                }

                // Devuelve respuesta exitosa
                res.json({ ok: true, total: rows.length });

            } catch (error) {
                console.log(error);

                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// Endpoint para consultar los logs almacenados en MongoDB
app.get('/logs', async (req, res) => {

    try {
        // Busca todos los documentos en la colección logs
        // Los ordena por fecha descendente
        // Convierte el cursor en arreglo
        const logs = await logsCollection
            .find()
            .sort({ created_at : -1 })
            .toArray();
        
        // Devuelve los logs en formato JSON
        res.json(logs);

    } catch (error) {
        res.status(500).json({ error: 'internal server error mongoDB' });
    }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('http://localhost:3000');
});