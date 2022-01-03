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

describe('Test /users/ responses', () => {
  beforeEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllUsers);
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored beforeEach test: ${error}`);
    }
  });

  afterEach(async () => {
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

  describe('Test POST /users/ responses', () => {

    it('status code should be 400 when first name is missing', async () => {
      const body = {
        lastname: 'kashef',
        password: 'password123'
      }
      const response = await request.post('/users').send(body);
      expect(response.status).toBe(400);
    });
    it('error message should be first name is required', async () => {
      const body = {
        lastname: 'kashef',
        password: 'password123'
      }
      const response = await request.post('/users').send(body);
      expect(response.body).toEqual({ error: 'first name is required' });
    });

    it('status code should be 400 when lastname is missing', async () => {
      const body = {
        firstname: 'magdy',
        password: 'password123'
      }
      const response = await request.post('/users').send(body);
      expect(response.status).toBe(400);
    });
    it('error message should be last name is required', async () => {
      const body = {
        firstname: 'kashef',
        password: 'password123'
      }
      const response = await request.post('/users').send(body);
      expect(response.body).toEqual({ error: 'last name is required' });
    });
    it('status code should be 400 when password is missing', async () => {
      const body = {
        firstname: 'magdy',
        lastname: 'kashef'
      }
      const response = await request.post('/users').send(body);
      expect(response.status).toBe(400);
    });
    it('error message should be password is required', async () => {
      const body = {
        firstname: 'magdy',
        lastname: 'kashef'
      }
      const response = await request.post('/users').send(body);
      expect(response.body).toEqual({ error: 'password is required' });
    });

    it('Should create a user', async () => {
      const body = {
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      }
      const response = await request.post('/users').send(body);
      expect(response.status).toBe(201);
      expect(response.body.user).toEqual({
        id: 1,
        firstname: 'magdy',
        lastname: 'kashef',
        password: response.body.user.password
      });
    });

  });


  describe('Test GET /users/ responses', () => {
    it('status code should be 401 when getting all users without JWT token', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(401);
    })

    it('should get all users', async () => {
      const body = {
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      }

      // create new user and receive a token
      const token = await (await request.post('/users').send(body)).body.token;

      const response = await request.get('/users').set('Authorization', 'Bearer ' + token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{
        id: 1,
        firstname: 'magdy',
        lastname: 'kashef',
        password: response.body[0].password
      }]);
    });

  });


  describe('Test GET /users/:id responses', () => {
    it('status code should be 401 when getting a specific user without JWT token', async () => {
      const user_id = 1;
      const response = await request.get(`/users/${user_id}`);
      expect(response.status).toBe(401);
    })

    it('Should get user with a specific id', async () => {
      const body = {
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      }
      const token = await (await request.post('/users').send(body)).body.token;
      const userId = 1
      const response = await request.get(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        firstname: 'magdy',
        lastname: 'kashef',
        password: response.body.password
      });
    });

  });
});
