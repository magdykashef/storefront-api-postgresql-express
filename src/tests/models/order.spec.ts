import { OrderStore } from "../../models/order";
import { ProductStore } from "../../models/product";
import { UserStore } from "../../models/user";
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

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

describe('Orders model', () => {

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


  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('Should create an order',
    async () => {
      const newUser = await userStore.create({
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      });

      const product = await productStore.create({
        name: 'jacker',
        price: 33
      });

      const order = await orderStore.create({
        product_id: product.id as number,
        quantity: 5,
        user_id: newUser.id as number,
        status: 'active',
      });

      expect(order).toEqual({
        id: 1,
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active',
      })

    });


  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });
  it('index method should return a list of orders',
    async () => {
      const newUser = await userStore.create({
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      });

      const product = await productStore.create({
        name: 'jacker',
        price: 33
      });

      await orderStore.create({
        id: 1,
        product_id: product.id as number,
        quantity: 5,
        user_id: newUser.id as number,
        status: 'active',
      });

      const result = await orderStore.index();
      expect(result).toEqual([{
        id: 1,
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active',
      }])
    });


  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });
  it('Should get an order with a specific user_id',
    async () => {

      const newUser = await userStore.create({
        firstname: 'magdy',
        lastname: 'kashef',
        password: 'password123'
      });

      const product = await productStore.create({
        name: 'jacker',
        price: 33
      });

      await orderStore.create({
        id: 1,
        product_id: product.id as number,
        quantity: 5,
        user_id: newUser.id as number,
        status: 'active',
      });

      const result = await orderStore.show(1);
      expect(result).toEqual({
        id: 1,
        product_id: 1,
        quantity: 5,
        user_id: 1,
        status: 'active',
      })
    });

});