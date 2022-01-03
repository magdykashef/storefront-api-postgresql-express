import supertest from 'supertest';
import app from '../../server';
import client from "../../database";

const deleteAllUsers = `DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
UPDATE users SET id = DEFAULT`;
const deleteAllProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;
const deleteAllOrders = `DELETE FROM orders;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;


const request = supertest(app);
let user;
let token: string;

describe('Test /products/ responses', () => {
  beforeAll(async () => {
    user = {
      firstname: 'magdy',
      lastname: 'kashef',
      password: 'password123'
    }
    // create new user and receive a token
    token = await (await request.post('/users').send(user)).body.token;
  })

  afterEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllProducts);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored afterEach test: ${error}`);
    }
  });
  afterAll(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllUsers);
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored afterEach test: ${error}`);
    }
  });

  describe('Test GET /products/ responses', () => {
    it('Should get all products', async () => {

      // create new product
      await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);


      const response = await request.get('/products/');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{
        id: 1,
        name: 'jacket',
        price: 90
      }]);
    });
  });

  describe('Test GET /products/:id responses', () => {
    it('Should get product with a specific id', async () => {

      // create new product
      await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      const product_id = 1;
      const response = await request.get(`/products/${product_id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'jacket',
        price: 90
      });
    });
  })

  
  describe('Test POST /products/ responses', () => {
    it('Should create product with JWT', async () => {

      // create new product
      const response = await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'jacket',
        price: 90
      });

    });
  });



});