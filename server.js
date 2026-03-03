// Importo las dependecias que voy a usar
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const mysql = require('mysql2/promise');
const fs = require('fs');

const { MongoClient } = require('mongodb');

const { create } = require('domain');


// URI de conexión a MongoDB local
const uri = process.env.DB_MONGO;

// Crea una nueva instancia del cliente de Mongo
const client = new MongoClient(uri);

const app = express();

// Configura Multer para guardar archivos subidos en la carpeta uploads/
const upload = multer({ dest: 'uploads/' });

// Creo un pool de conexiones a MySQL 
const db = mysql.createPool({
    host: process.env.DB_HOST,            
    user: process.env.DB_USER,             
    password: process.env.DB_PASSWORD,     
    database: process.env.DB_NAME,         
    waitForConnections: true,              
    connectionLimit: 40,                  
    queueLimit: 0                          
});


// Función para probar la conexión a MySQL
async function connectMysql() {
    try {

        const connection = await db.getConnection();
        console.log('Conectado a MySQL');

        connection.release();

    } catch (error) {
        console.error('Error al conectar a MySQL:', error);

        process.exit(1);
    }
}


connectMysql();


let logsCollection;

// Función para conectarse a MongoDB
async function connectDB() {
    try {

        await client.connect();
        console.log('Conectado a MongoDB');
        const db = client.db('app');
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

app.get('/',(req, res)=>{

    res.send('Prueba de desempeño - Bases de datos')
})

// Insercion de Datos
// -------------------------------------------------------------------------------------
// 1. Endpoint para subir archivo CSV de categories

app.post('/api/upload/categories', upload.single('archivo'), (req, res) => {

    // Arreglo donde se guardarán las filas del CSV
    const rows = [];

    // Lee el archivo subido desde el sistema de archivos
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', row => rows.push(row))
        .on('end', async () => {
            try {

              
                if (rows.length) {

         
                    const values = rows
                        .map(r => `('${r.id_category}','${r.name}')`)
                        .join(',');

         
                    await db.query(`INSERT INTO categories (id_category, name) VALUES ${values}`);

      
                    saveLog('INSERT INTO categories');
                }


                res.json({ ok: true, total: rows.length });

            } catch (error) {
      
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

                    const values = rows
                        .map(r => `('${r.id_supplier}','${r.name}','${r.email}')`)
                        .join(',');

                    await db.query(`INSERT INTO suppliers (id_supplier, name, email) VALUES ${values}`);


                    saveLog('INSERT INTO suppliers');
                }

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

                    const values = rows
                        .map(r => `('${r.id_customer}','${r.name}','${r.email}','${r.address}','${r.phone}')`)
                        .join(',');

                    await db.query(`INSERT INTO customers (id_customer, name, email, address, phone) VALUES ${values}`);


                    saveLog('INSERT INTO customers');
                }

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

                    const values = rows
                        .map(r => `('${r.id_product}','${r.product_sku}','${r.name}','${r.unit_price}','${r.id_category}','${r.id_supplier}')`)
                        .join(',');

                    await db.query(`INSERT INTO products (id_product, product_sku, name, unit_price, id_category, id_supplier) VALUES ${values}`);


                    saveLog('INSERT INTO products');
                }

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

                    const values = rows
                        .map(r => `('${r.id_transaction}','${r.date}','${r.quantity}','${r.total_line_value}','${r.id_costomer}','${r.id_product}')`)
                        .join(',');

                    await db.query(`INSERT INTO transactions (id_transaction, date, quantity, total_line_value, id_costomer, id_product) VALUES ${values}`);


                    saveLog('INSERT INTO transactions');
                }

                res.json({ ok: true, total: rows.length });

            } catch (error) {
                console.log(error);

                res.status(500).json({ error: 'internal server error' });
            }
        });
});

// -------------------------------------------------------------------------------------

// Consultas 
// -------------------------------------------------------------------------------------

// Análisis de proveedores:
// o "Necesito saber qué proveedores nos han vendido más productos (en cantidad
// de items) y cuál es el valor total del inventario que tenemos asociado a cada
// uno."

app.get(`/query/inventario/provedor`, (req, res) => {

  const query =    `SELECT s.name AS name,
                    SUM(t.quantity) AS total_items,
                    SUM(p.unit_price * t.quantity) AS total
                    FROM suppliers s
                    JOIN products p ON s.id_supplier = p.id_supplier
                    JOIN transactions t ON p.id_product = t.id_product
                    GROUP BY s.id_supplier
                    ORDER BY total DESC;`;   

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }
    console.log(res.json(results)); 
  });
});   

// Comportamiento del cliente:
// o "Quiero ver el historial de compras de un cliente específico, detallando
// productos, fechas y el total gastado en cada transacción."

app.get(`/query/history/trasactions`, (req, res) => {

  const query =    `SELECT c.name AS name,  
                    p.name AS product,
                    t.date AS date,
                    t.total_line_value AS total               
                    FROM customers c
                    JOIN transactions t ON c.id_customer = t.id_costomer
                    JOIN products p ON t.id_product = p.id_product
                    WHERE c.id_customer = 2;`;   

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }
    console.log(res.json(results)); 
  });
}); 

// Productos estrella:
// o "Genera un listado de los productos más vendidos dentro de una categoría
// específica, ordenados por ingresos generados."
// (Nota: Para SQL, esto requiere JOINs/Group By. Para NoSQL, esto requiere Aggregation
// Framework).


app.get(`/query/products/sales`, (req, res) => {

  const query =    `SELECT c.name AS category,
                    p.name AS product,
                    SUM(t.quantity) AS items,
                    SUM(p.unit_price * t.quantity) AS total
                    FROM products p
                    JOIN transactions t ON p.id_product = t.id_product
                    JOIN categories c ON p.id_category = c.id_category 
                    GROUP BY p.id_product
                    ORDER BY total DESC;`;   

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }
    console.log(res.json(results)); 
  });
}); 



// -------------------------------------------------------------------------------------

// Endpoint para consultar los logs almacenados en MongoDB
app.get('/logs', async (req, res) => {

    try {

        const logs = await logsCollection
            .find()
            .sort({ created_at : -1 })
            .toArray();
        
        res.json(logs);

    } catch (error) {
        res.status(500).json({ error: 'internal server error mongoDB' });
    }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('http://localhost:3000');
});