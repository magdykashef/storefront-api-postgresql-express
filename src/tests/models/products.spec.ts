import { ProductStore } from "../../models/product";
import client from "../../database";


const deleteAllProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;

const store = new ProductStore();
describe('Products model', () => {
  beforeEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllProducts);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored beforeEach test: ${error}`);
    }
  });

  afterEach(async () => {
    try {
      const conn = await client.connect();
      await conn.query(deleteAllProducts);
      conn.release();
    } catch (error) {
      throw new Error(`unable to delete all recored afterEach test: ${error}`);
    }
  });
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
  it('Should create a product',
    async () => {
      const result = await store.create({
        name: 'jacket',
        price: 50
      });
      expect(result).toEqual({
        id: 1,
        name: 'jacket',
        price: 50
      })
    });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('index method should return a list of Products',
    async () => {
      const newProduct = await store.create({
        name: 'jacket',
        price: 50
      });

      const result = await store.index();
      expect(result).toEqual([{
        id: 1,
        name: 'jacket',
        price: 50
      }])
    });


  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('Should get product with a specific id',
    async () => {
      const newProduct = await store.create({
        name: 'jacket',
        price: 50
      });
      const result = await store.show(1);
      expect(result).toEqual({
        id: 1,
        name: 'jacket',
        price: 50
      })
    });

});