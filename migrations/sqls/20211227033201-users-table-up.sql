CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  firstname VARCHAR(50) NOT NULL, 
  lastname VARCHAR(50) NOT NULL, 
  password VARCHAR(1000) NOT NULL
  );
