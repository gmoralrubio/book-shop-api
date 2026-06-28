import express, {Request, Response} from 'express';

const api = express();

api.use(express.json());
api.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello world');
});

export default api;
