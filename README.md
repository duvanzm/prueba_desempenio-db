

# STUDENT INFORMATION


- ***Name:*** Duvan Alexander Zuluaga Macias
- ***ID Number:*** 1045113839
- ***Clan:*** Mc Carthy
- ***GitHub Repository:***

---

# PROJECT DESCRIPTION


One of their largest clients, the supply giant "MegaStore Global," is facing an operational crisis.
For years, they have managed all their inventory, sales, suppliers, and customers in a single master Excel file.

---

# TECHNOLOGIES USED

- Node.js
- Express
- MySQL
- MongoDB
- Multer (file upload)
- csv-parse (CSV processing)

---


# STEPS TO RUN THE PROJECT LOCALLY

## 1. Clone the repository

```
git clone repo

```
## 2. Install dependencies

- locate yourself in the project file

```
cd repo
```

- install dependencies

```
npm install express multer csv-parse mysql2 mongodb dotenv

npm install dotenv
```

## 3. Create the tables in the database 

- Run the DDL commands in the database ORM

### Entidades Fuertes
```
CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL UNIQUE
);
```
```
CREATE TABLE suppliers (
    id_supplier INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
```
```
CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);
```

### Entidades Debiles
```
CREATE TABLE products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    product_sku VARCHAR(100) NOT NULL,
    name VARCHAR(45) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    id_category INT NOT NULL,
    id_supplier INT NOT NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id_category),
    FOREIGN KEY (id_supplier) REFERENCES suppliers(id_supplier)
);
```
```
CREATE TABLE transactions (
    id_transaction VARCHAR(20) PRIMARY KEY UNIQUE,
    date DATE NOT NULL,
    quantity INT UNSIGNED NOT NUll,
    total_line_value DECIMAL(10,2) NOT NULL,
    id_costomer INT NOT NULL,
    id_product INT NOT NULL,
    FOREIGN KEY (id_costomer) REFERENCES customers(id_customer),
    FOREIGN KEY (id_product) REFERENCES products(id_product)
);
```



# 4. Start the server


```
node server.js
```

# 5. Use Postman for Insertions and Queries



# MODEL JUSTIFICATION

I used the 1NF, 2NF, and 3NF normalization methods to break down the information into related tables


# EXPLANATION OF THE NORMALIZATION PROCESS OR NOSQL DESIGN


- Datos iniciales 

![imgInicial](./docs/Normalizacion/tablaInicial.png)
img

## Entidades

1. Customers

![imgCustomers](./docs/Normalizacion/customers.png) 

2. Categories

![imgCustomers](./docs/Normalizacion/category.png) 

3. Products

![imgCustomers](./docs/Normalizacion/products.png) 

4. suppliers

![imgCustomers](./docs/Normalizacion/suppliers.png) 

5. Transactions

![imgCustomers](./docs/Normalizacion/tranasctions.png) 


## DER

![der](./docs/DER/Imagen%20pegada%20(2).png)




# GUIDE TO THE BULK MIGRATION PROCESS

- The process works as follows:

1. The user sends a CSV file via a POST request.

2. Multer temporarily saves the file in the uploads/ folder.

3. The system reads the file using fs.createReadStream.

4. The csv-parse package converts each row into a JavaScript object.

5. A bulk INSERT query is constructed.

6. The data is inserted into MySQL.

7. The action is logged in MongoDB.

8. The number of records inserted is returned.


# ENDPOINT DESCRIPTION

1. Subir Categories

- Endpoint POST

```
http://localhost:3000/api/upload/categories
```


2. Subir suppliers
- Endpoint POST

```
http://localhost:3000/api/upload/suppliers
 ```



3. Subir customers

- Endpoint POST

 ```
http://localhost:3000/api/upload/customers
 ```


4. Subir products

- Endpoint POST

 ```
http://localhost:3000/api/upload/products
 ```


5. Subir transactions

- Endpoint POST

 ```
http://localhost:3000/api/upload/transactions
 ```




6. Análisis de proveedores:

- Endpoint GET

 ```
http://localhost:3000/query/history/customer
 ```



7. Comportamiento del cliente:

- Endpoint GET

 ```
http://localhost:3000/query/history/trasactions
 ```




8. Productos estrella:

- Endpoint GET

 ```
http://localhost:3000/query/products/sales
 ```

9. Consultar Logs

- Endpoint GET

 ```
http://localhost:3000/logs
 ```

 ## CONEXION

``
DB_HOST=157.180.40.190
DB_USER=root
DB_PASSWORD=scORHWprCvp26Gz1zwPQgSsokHyPC2
DB_NAME=db_duvan_csv
DB_PORT=3001
PORT=3000 


DB_MONGO=mongodb://duvan:password@localhost:27017
``