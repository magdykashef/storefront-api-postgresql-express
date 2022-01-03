import { UserStore } from "../../models/user";
import client from "../../database";


const userStore = new UserStore();

const deleteAllUsers = `DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
UPDATE users SET id = DEFAULT`;
const deleteAllProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;
const deleteAllOrders = `DELETE FROM orders;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;
// const deleteAllOrderProducts = `DELETE FROM order_products;
// ALTER SEQUENCE order_products_id_seq RESTART WITH 1;
// UPDATE order_products SET id = DEFAULT`;

describe('Users model', () => {
  beforeEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllUsers);
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      // await conn.query(deleteAllOrderProducts);
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
      // await conn.query(deleteAllOrderProducts);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored afterEach test: ${error}`);
    }
  });


  it('should have a create method', () => {
    expect(userStore.create).toBeDefined();
  });
  it('Should create a user',
    async () => {
      const newUser = await userStore.create({
        firstname: 'steve',
        lastname: 'jobs',
        password: 'password123'
      });
      expect(newUser).toEqual({
        id: 1,
        firstname: 'steve',
        lastname: 'jobs',
        password: newUser.password,
      })

    });

  it('should have an index method', () => {
    expect(userStore.index).toBeDefined();
  });
  it('index method should return a list of users',
    async () => {
      const result = await userStore.index();
      expect(result).toEqual([])
    });


  it('should have a show method', () => {
    expect(userStore.show).toBeDefined();
  });
  it('Should get a user with a specific id',
    async () => {
      const newUser = await userStore.create({
        firstname: 'Elon',
        lastname: 'Musk',
        password: 'password123'
      });

      const result = await userStore.show(1);

      expect(result).toEqual({
        id: 1,
        firstname: 'Elon',
        lastname: 'Musk',
        password: result.password,
      })
    });

});