import { OrderStore } from "../../models/order";
import { ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";
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
const deleteAllOrderProducts = `DELETE FROM order_products;
ALTER SEQUENCE order_products_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;



const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

let newUser: User;

describe('Orders model', () => {

  beforeAll(async () => {
    newUser = await userStore.create({
      firstname: 'magdy',
      lastname: 'kashef',
      password: 'password123'
    });
  })


  beforeEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllProducts);
      await conn.query(deleteAllOrders);
      await conn.query(deleteAllOrderProducts);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored beforeEach test: ${error}`);
    }
  });


  afterEach(async () => {
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
      await conn.query(deleteAllOrderProducts);
      await conn.query(deleteAllUsers);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored afterAll test: ${error}`);
    }
  })
  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });
  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });
  it('should have addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined();
  });


  it('Should create an order',
    async () => {

      const order = await orderStore.create({
        user_id: newUser.id as number,
        status: 'active',
      });

      expect(order).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
      })

    });

  it('index method should return a list of orders',
    async () => {
      await orderStore.create({
        id: 1,
        user_id: newUser.id as number,
        status: 'active',
      });

      const result = await orderStore.index();
      expect(result).toEqual([{
        id: 1,
        user_id: 1,
        status: 'active',
      }])
    });


  it('Should add product to cart',
    async () => {
      const newProduct = await productStore.create({
        name: 'jacket',
        price: 50
      });

      const newOrder = await orderStore.create({
        id: 1,
        user_id: newUser.id as number,
        status: 'active',
      });

      const result = await orderStore.addProduct(newOrder.id as number, newProduct.id as number, 4);

      expect(result).toEqual({
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 4,
      })
    });


  it('Should get an order with a specific user_id',
    async () => {
      const newProduct = await productStore.create({
        name: 'jacket',
        price: 50
      });

      const newOrder = await orderStore.create({
        id: 1,
        user_id: newUser.id as number,
        status: 'active',
      });

      await orderStore.addProduct(newOrder.id as number, newProduct.id as number, 4);

      const result = await orderStore.show(1);

      expect(result).toEqual({
        id: 1,
        user_id: 1,
        status: 'active',
        order_id: 1,
        product_id: 1,
        quantity: 4
      })
    });


});