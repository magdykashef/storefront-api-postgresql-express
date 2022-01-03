import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price?: number;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      const products = result.rows as Product[];

      conn.release();
      return products;
    } catch (error) {
      throw new Error(`unable to get products: ${error}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id = ($1)';
      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0] as Product;
    } catch (error) {
      throw new Error(`Unable to get product: ${error}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [product.name, product.price]);
      const newProduct = result.rows[0] as Product;
      conn.release();
      return newProduct;
    } catch (err) {
      throw new Error(`Cannot create product: ${err}`);
    }
  }
  

}