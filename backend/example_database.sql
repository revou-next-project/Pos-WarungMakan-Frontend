-- Example database schema for Food POS System

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Categories for products
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    unit VARCHAR(20) NOT NULL,
    is_package BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inventory items (raw materials)
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    min_stock DECIMAL(10, 2) DEFAULT 0,
    cost_per_unit DECIMAL(10, 2) NOT NULL,
    last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe components (links products to inventory items)
CREATE TABLE recipe_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    inventory_item_id INT NOT NULL,
    quantity DECIMAL(10, 3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_type ENUM('dine-in', 'grab', 'gojek', 'shopee') DEFAULT 'dine-in',
    status ENUM('waiting', 'cooking', 'completed', 'canceled') DEFAULT 'waiting',
    payment_method ENUM('cash', 'qris', 'transfer') NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_type ENUM('percentage', 'nominal') NULL,
    discount_value DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Order items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'qris', 'transfer') NOT NULL,
    cash_amount DECIMAL(10, 2) NULL,
    change_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    transaction_id VARCHAR(100) NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Expenses
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    recorded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Cash balance tracking
CREATE TABLE cash_balance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type ENUM('opening', 'closing', 'sale', 'expense', 'adjustment') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reference_id INT NULL,
    notes TEXT,
    recorded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Store settings
CREATE TABLE store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    tax_rate DECIMAL(5, 2) DEFAULT 10.00,
    currency VARCHAR(3) DEFAULT 'IDR',
    logo_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data inserts

-- Users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$encrypted_password_hash', 'admin'),
('Cashier 1', 'cashier1@example.com', '$2y$10$encrypted_password_hash', 'cashier');

-- Categories
INSERT INTO categories (name, description) VALUES
('Food', 'Main food items'),
('Drinks', 'Beverages'),
('Snacks', 'Light snacks and sides'),
('Frozen Food', 'Frozen items'),
('Packages', 'Combo meals and packages');

-- Products
INSERT INTO products (name, price, category_id, unit, is_package, image_url) VALUES
('Rice Box Chicken', 20000, 1, 'box', FALSE, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80'),
('Fishball Satay', 10000, 1, 'stick', FALSE, 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&q=80'),
('Iced Tea', 5000, 2, 'cup', FALSE, 'https://images.unsplash.com/photo-1556679343-c1c1c9308e4e?w=300&q=80'),
('Mineral Water', 3000, 2, 'bottle', FALSE, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80'),
('French Fries', 15000, 3, 'portion', FALSE, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=80'),
('Frozen Meatballs', 25000, 4, 'pack', FALSE, 'https://images.unsplash.com/photo-1529042355636-0e9d8b0b01b7?w=300&q=80'),
('Package A', 25000, 5, 'package', TRUE, 'https://images.unsplash.com/photo-1607877742574-a7d9a7449af3?w=300&q=80'),
('Package B', 35000, 5, 'package', TRUE, 'https://images.unsplash.com/photo-1607877742574-a7d9a7449af3?w=300&q=80');

-- Inventory items
INSERT INTO inventory_items (name, quantity, unit, min_stock, cost_per_unit) VALUES
('Rice', 50, 'kg', 10, 12000),
('Chicken', 30, 'kg', 5, 35000),
('Fishball', 100, 'pcs', 20, 500),
('Tea Bags', 200, 'pcs', 50, 300),
('Sugar', 20, 'kg', 5, 15000),
('Potatoes', 40, 'kg', 10, 10000),
('Cooking Oil', 30, 'liter', 5, 20000),
('Mineral Water Bottles', 100, 'bottle', 24, 2000);

-- Recipe components
INSERT INTO recipe_components (product_id, inventory_item_id, quantity) VALUES
(1, 1, 0.15), -- Rice Box uses 150g rice
(1, 2, 0.1),  -- Rice Box uses 100g chicken
(2, 3, 5),    -- Fishball Satay uses 5 fishballs
(3, 4, 1),    -- Iced Tea uses 1 tea bag
(3, 5, 0.02), -- Iced Tea uses 20g sugar
(5, 6, 0.2),  -- French Fries uses 200g potatoes
(5, 7, 0.05); -- French Fries uses 50ml cooking oil

-- Cash balance sample data
INSERT INTO cash_balance (transaction_date, transaction_type, amount, notes, recorded_by) VALUES
(NOW() - INTERVAL 7 DAY, 'opening', 1000000, 'Initial cash balance', 1),
(NOW() - INTERVAL 6 DAY, 'sale', 250000, 'Day 1 sales', 1),
(NOW() - INTERVAL 6 DAY, 'expense', 50000, 'Supplies purchase', 1),
(NOW() - INTERVAL 5 DAY, 'sale', 300000, 'Day 2 sales', 1),
(NOW() - INTERVAL 4 DAY, 'expense', 75000, 'Ingredient purchase', 1),
(NOW() - INTERVAL 3 DAY, 'sale', 275000, 'Day 3 sales', 1),
(NOW() - INTERVAL 2 DAY, 'sale', 325000, 'Day 4 sales', 1),
(NOW() - INTERVAL 1 DAY, 'expense', 100000, 'Weekly cleaning service', 1),
(NOW(), 'adjustment', 5000, 'Cash count adjustment', 1);

-- Store settings
INSERT INTO store_settings (store_name, address, phone, tax_rate, currency) VALUES
('Warung Makan', 'Jl. Contoh No. 123, Jakarta', '021-1234567', 10.00, 'IDR');
