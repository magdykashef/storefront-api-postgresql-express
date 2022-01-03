CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id integer REFERENCES products(id) ON DELETE CASCADE,
    quantity integer NOT NULL,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(8) NOT NULL
);