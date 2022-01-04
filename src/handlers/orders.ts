import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/jwt';
import { OrderStore } from '../models/order';

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    if (!order) {
      return res.status(400).json({ error: 'order is not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const order = await store.create({
      user_id: parseInt(req.body.user_id),
      status: req.body.status
    });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

const addProduct = async (req: Request, res: Response) => {
  const order_id: number = parseInt(req.body.order_id);
  const product_id: number = parseInt(req.body.product_id);
  const quantity: number = parseInt(req.body.quantity);
  
  try {
    const addedProduct = await store.addProduct(order_id, product_id, quantity);
    res.status(201).json(addedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
}

const orderRoutes = (app: express.Application) => {
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
}

export default orderRoutes;