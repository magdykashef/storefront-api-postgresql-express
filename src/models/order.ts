import client from "../database";


export type OrderProducts = {
  id: number,
  user_id: number,
  order_id: number,
  product_id: number,
  quantity: number,
  status: 'active' | 'completed',
}

export type Order = {
  id?: number;
  user_id: number;
  status: 'active' | 'complete';
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      const products = result.rows as Order[];

      conn.release();
      return products;
    } catch (error) {
      throw new Error(`unable to get orders: ${error}`);
    }
  }

  async show(userId: number): Promise<OrderProducts> {
    try {
      const sql = 'SELECT * from orders JOIN order_products ON (orders.id = order_products.id) WHERE user_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [userId]);
      const order = result.rows[0] as OrderProducts;

      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Cannot get order: ${error}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {

      const conn = await client.connect();
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.user_id, order.status]);
      const newOrder = result.rows[0] as Order;
      conn.release();
      return newOrder;
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }


  async addProduct(order_id: number, product_id: number, quantity: number): Promise<{ id: number, order_id: number, product_id: number, quantity: number }> {
    try {
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [order_id, product_id, quantity]);
      const orderProduct = result.rows[0];

      conn.release();      
      return orderProduct;
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}: ${err}`)
    }
  }



}
