// Entidades Fuertes

CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE suppliers (
    id_supplier INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);


// Entidades Debiles

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


