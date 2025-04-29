// app.js
const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());  // :contentReference[oaicite:0]{index=0}

// Dummy data inicial
let products = [
  { id: 1, nombre: 'Laptop', precio: 1200, categoriaID: 10, descripcion: 'Laptop gaming' },
  { id: 2, nombre: 'Mouse', precio: 25,   categoriaID: 20, descripcion: 'Mouse inalámbrico' },
];

// --- GET /product: listar todos los productos ---
/** 
 * Éxito:
 * curl -X GET "http://127.0.0.1:8000/product" \
 *   -H "Accept: application/json"
 *
 * Error (simular lanzando excepción en código):
 * curl -X GET "http://127.0.0.1:8000/product?fail=true" \
 *   -H "Accept: application/json"
 */
app.get('/product', (req, res, next) => {
  try {
    if (req.query.fail) throw new Error('Forzado error de prueba');
    res.status(200).json({ datos: products });  // :contentReference[oaicite:1]{index=1}
  } catch (err) {
    next(err);
  }
});

// --- GET /product/:id: obtener un producto por ID ---
/** 
 * Éxito:
 * curl -X GET "http://127.0.0.1:8000/product/1" \
 *   -H "Accept: application/json"
 *
 * Error (producto no existe):
 * curl -X GET "http://127.0.0.1:8000/product/999" \
 *   -H "Accept: application/json"
 */
app.get('/product/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);  // :contentReference[oaicite:2]{index=2}
    const prod = products.find(p => p.id === id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(200).json({ datos: prod });
  } catch (err) {
    next(err);
  }
});

// --- POST /product: crear un nuevo producto ---
/** 
 * Éxito:
 * curl -X POST "http://127.0.0.1:8000/product" \
 *   -H "Content-Type: application/json" \
 *   -d '{ "nombre":"Teclado", "precio":45, "categoriaID":20, "descripcion":"Teclado mecánico" }'
 *
 * Error (falta campo):
 * curl -X POST "http://127.0.0.1:8000/product" \
 *   -H "Content-Type: application/json" \
 *   -d '{ "nombre":"Teclado" }'
 */
app.post('/product', (req, res, next) => {
  try {
    const { nombre, precio, categoriaID, descripcion } = req.body;  // :contentReference[oaicite:3]{index=3}
    if (!nombre || precio == null || !categoriaID || !descripcion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const newProduct = {
      id: products.length + 1,
      nombre,
      precio,
      categoriaID,
      descripcion
    };
    products.push(newProduct);
    res.status(201).json({ datos: newProduct });
  } catch (err) {
    next(err);
  }
});

// --- PUT /product/:id: actualizar un producto existente ---
/** 
 * Éxito:
 * curl -X PUT "http://127.0.0.1:8000/product/1" \
 *   -H "Content-Type: application/json" \
 *   -d '{ "nombre":"Laptop Pro", "precio":1500, "categoriaID":10, "descripcion":"Modelo Pro" }'
 *
 * Error (producto no existe):
 * curl -X PUT "http://127.0.0.1:8000/product/999" \
 *   -H "Content-Type: application/json" \
 *   -d '{ "nombre":"Nada", "precio":0, "categoriaID":0, "descripcion":"Nada" }'
 */
app.put('/product/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const { nombre, precio, categoriaID, descripcion } = req.body;
    if (!nombre || precio == null || !categoriaID || !descripcion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    products[index] = { id, nombre, precio, categoriaID, descripcion };
    res.status(200).json({ datos: products[index] });
  } catch (err) {
    next(err);
  }
});

// --- DELETE /product/:id: eliminar un producto ---
/** 
 * Éxito:
 * curl -X DELETE "http://127.0.0.1:8000/product/2" \
 *   -H "Accept: application/json"
 *
 * Error (producto no existe):
 * curl -X DELETE "http://127.0.0.1:8000/product/999" \
 *   -H "Accept: application/json"
 */
app.delete('/product/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const deleted = products.splice(index, 1)[0];
    res.status(200).json({ datos: deleted });
  } catch (err) {
    next(err);
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);  // :contentReference[oaicite:4]{index=4}
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Levantar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
