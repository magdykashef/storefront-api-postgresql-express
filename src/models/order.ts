import client from "../database";


export type Order = {
  id?: number;
  product_id: number;
  quantity: number;
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

  async show(user_id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders where user_id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      const order = result.rows[0] as Order;

      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Cannot get order: ${error}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {

      const conn = await client.connect();
      const sql = 'INSERT INTO orders (product_id, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [order.product_id, order.quantity, order.user_id, order.status]);
      const newOrder = result.rows[0] as Order;
      conn.release();
      return newOrder;
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  // async addProduct(quantity: number, orderId: number, productId: number): Promise<{ id: number, quantity: number, order_id: number, product_id: number }> {
  //   try {
  //     const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
  //     const conn = await client.connect();
  //     const result = await conn.query(sql, [quantity, orderId, productId]);
  //     const order = result.rows[0];

  //     conn.release();
  //     return order;
  //   } catch (err) {
  //     throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
  //   }
  // }



}
