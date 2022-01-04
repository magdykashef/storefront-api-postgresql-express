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
const deleteAllOrderProducts = `DELETE FROM order_products;
ALTER SEQUENCE order_products_id_seq RESTART WITH 1;
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
      await conn.query(deleteAllOrderProducts);
      conn.release();

      const body = {
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      }
      // create new user and receive a token
      const result = await (await request.post('/users').send(body)).body;
      user = result.user;
      token = result.token;
    } catch (error) {
      throw new Error(`unable to delete all recored beforeEach test: ${error}`);
    }
  });


  beforeEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      await conn.query(deleteAllOrderProducts);

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
      await conn.query(deleteAllOrderProducts);

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
      const newOrder = await request.post('/orders').send({
        user_id: user.id,
        status: 'active'
      }).set('Authorization', 'Bearer ' + token);

      expect(newOrder.statusCode).toBe(200);
      expect(newOrder.body).toEqual({
        id: 1,
        user_id: 1,
        status: 'active'
      });
    });
  });

  describe('TEST POST /orders/:id/products responses', () => {
    it('Should add product to an order with a specific order_id with JWT token', async () => {
      // create new product
      const newProduct = await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      // create new order
      const newOrder = await request.post('/orders').send({
        user_id: user.id,
        status: 'active'
      }).set('Authorization', 'Bearer ' + token);

      // add product to order
      const orderProduct = await request.post(`/orders/${newOrder.body.id}/products`).send({
        order_id: parseInt(newOrder.body.id),
        product_id: parseInt(newProduct.body.id),
        quantity: 2
      }).set('Authorization', 'Bearer ' + token);

      expect(orderProduct.statusCode).toBe(201);
      expect(orderProduct.body).toEqual({
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2
      });
    });
  })
  describe('TEST GET /orders/:user_id responses', () => {
    it('Should get order related to a specific user_id with JWT token', async () => {
      // create new product
      const newProduct = await request.post('/products').send({
        name: 'jacket',
        price: 90,
      }).set('Authorization', 'Bearer ' + token);

      // create new order
      const newOrder = await request.post('/orders').send({
        user_id: user.id,
        status: 'active'
      }).set('Authorization', 'Bearer ' + token);

      // add product to order
      const orderProduct = await request.post(`/orders/${newOrder.body.id}/products`).send({
        order_id: parseInt(newOrder.body.id),
        product_id: parseInt(newProduct.body.id),
        quantity: 2
      }).set('Authorization', 'Bearer ' + token);

      // GET order related to a specific user_id
      const response = await request.get(`/orders/${user.id}`).set('Authorization', 'Bearer ' + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        user_id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2,
        status: 'active',
      });
    });
  });

});