import express, { Request, Response } from 'express';
import verifyAuthToken from '../middlewares/jwt';
import { ProductStore, Product } from '../models/product';


const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    if (!products) {
      return res.status(404).json({error:'products are not found'});
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
}

const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send({ error: 'product_id is required' });
  }
  try {
    const product = await store.show(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({error:'product not found'});
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error);
  }
}


const create = async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).send({ error: 'product name is required' });
  }
  if (!req.body.price) {
    return res.status(400).send({ error: 'product price is required' });
  }
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
    }
    const newProduct = await store.create(product);
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
}


const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
}

export default productRoutes;