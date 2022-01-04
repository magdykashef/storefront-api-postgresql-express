CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(8) NOT NULL
);