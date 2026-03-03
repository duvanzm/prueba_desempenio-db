Consultas avanzadas (Business Intelligence)

Análisis de proveedores:
o "Necesito saber qué proveedores nos han vendido más productos (en cantidad
de items) y cuál es el valor total del inventario que tenemos asociado a cada
uno."
SELECT s.name AS name,
SUM(t.quantity) AS total_items,
SUM(p.unit_price * t.quantity) AS total
FROM suppliers s
JOIN products p ON s.id_supplier = p.id_supplier
JOIN transactions t ON p.id_product = t.id_product
GROUP BY s.id_supplier
ORDER BY total DESC;

Comportamiento del cliente:
o "Quiero ver el historial de compras de un cliente específico, detallando
productos, fechas y el total gastado en cada transacción."

SELECT c.name AS name,  
p.name AS product,
t.date AS date,
t.total_line_value AS total               
FROM customers c
JOIN transactions t ON c.id_customer = t.id_costomer
JOIN products p ON t.id_product = p.id_product
WHERE c.id_customer = 2;

Productos estrella:
o "Genera un listado de los productos más vendidos dentro de una categoría
específica, ordenados por ingresos generados."

SELECT c.name AS category,
p.name AS product,
SUM(t.quantity) AS items,
SUM(p.unit_price * t.quantity) AS total
FROM products p
JOIN transactions t ON p.id_product = t.id_product
JOIN categories c ON p.id_category = c.id_category 
GROUP BY p.id_product
ORDER BY total DESC




(Nota: Para SQL, esto requiere JOINs/Group By. Para NoSQL, esto requiere Aggregation
Framework).