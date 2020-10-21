
import express from 'express';
import './db/connection';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import 'express-async-errors';
import errorHandler from './errors/handler';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333);