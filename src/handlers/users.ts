import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from 'jsonwebtoken';
import verifyAuthToken from "../middlewares/jwt";

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    if (!users) {
      return res.status(404).json({error:'users are not found'});
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send({ error: 'user_id is required' });
  }
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    if (!user) {
      return res.status(404).json({error:'user is not found'});
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const create = async (req: Request, res: Response) => {
  if (!req.body.firstname) {
    return res.status(400).send({ error: 'first name is required' });
  }
  if (!req.body.lastname) {
    return res.status(400).send({ error: 'last name is required' });
  }
  if (!req.body.password) {
    return res.status(400).send({ error: 'password is required' });
  }

  try {
    const user: User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    }
    const newUser = await store.create(user);
    //create new token
    const token = jwt.sign({ user: newUser }, `${process.env.TOKEN_SECRET}`);
    return res.status(201).send({ user: newUser, token });
  } catch (error) {
    return res.status(400).json(error);
  }
}

// const authenticate = async (req: Request, res: Response) => {
//   try {
//     const user: User = {
//       firstname: req.body.firstname,
//       lastname: req.body.lastname,
//       password: req.body.password,
//     }
//     const user = await store.authenticate(user.firstname, user.password);
//     const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);
//     return res.json(token);
//   } catch (error) {
//     return res.status(401).json({ error });
//   }
// }

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
}

export default userRoutes;