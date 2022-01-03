import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/jwt';
import { OrderStore } from '../models/order';

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    if (!order) {
      return res.status(400).json({error:'order is not found'});
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const order = await store.create({
      product_id: parseInt(req.body.product_id),
      quantity: parseInt(req.body.quantity),
      user_id: parseInt(req.body.user_id),
      status: req.body.status,
    });
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

// const addProduct = async (req: Request, res: Response) => {
//   const orderId: string = req.params.id;
//   const productId: string = req.body.productId;
//   const quantity: number = parseInt(req.body.quantity);

//   try {
//     const addedProduct = await store.addProduct(quantity, +orderId, +productId);
//     res.status(201).json(addedProduct);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }

const orderRoutes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create);
  app.get('/orders/:id', verifyAuthToken, show);
}

export default orderRoutes;