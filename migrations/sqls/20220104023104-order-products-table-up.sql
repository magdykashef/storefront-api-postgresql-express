CREATE TABLE order_products (
id SERIAL PRIMARY KEY,
order_id integer REFERENCES orders(id) ON DELETE CASCADE,
product_id integer REFERENCES products(id) ON DELETE CASCADE,
quantity integer NOT NULL
);