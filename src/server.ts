import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

dotenv.config();

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200 // some legacy browsers
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req: Request, res: Response) {
    res.send('Main API route')
});

userRoutes(app);
orderRoutes(app);
productRoutes(app);



app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
});

export default app;
