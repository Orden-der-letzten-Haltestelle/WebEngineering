CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT
);

INSERT INTO products (name, price, description) VALUES
('T-Shirt', 19.99, 'Bequemes Baumwoll-T-Shirt'),
('Hoodie', 39.99, 'Warmer Hoodie für den Winter');