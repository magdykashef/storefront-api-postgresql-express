import supertest from 'supertest';
import app from '../../server';
import client from "../../database";
import { User } from '../../models/user';

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
let user: User;
let token: string;

describe('Test /orders responses', () => {
  beforeAll(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllUsers);
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      conn.release();

      user = {
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      }
      // create new user and receive a token
      token = await (await request.post('/users').send(user)).body.token;

    } catch (error) {
      throw new Error(`unable to delete all recored beforeEach test: ${error}`);
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

  describe('TEST POST /orders/ responses', () => {
    it('Should create order with JWT token', async () => {
      // create new product
      await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      // create new order
      const response = await request.post('/orders').send({
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active'
      }).set('Authorization', 'Bearer ' + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active'
      });
    });
  })

  describe('TEST GET /orders/:user_id responses', () => {
    it('Should get correct order with a specific user_id with JWT token', async () => {
      // create new product
      await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      // create new order
      await request.post('/orders').send({
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active'
      }).set('Authorization', 'Bearer ' + token);

      // GET order with a specific user_id
      const user_id = 1;
      const response = await request.get(`/orders/${user_id}`).set('Authorization', 'Bearer ' + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active'
      });
    });
  })

});