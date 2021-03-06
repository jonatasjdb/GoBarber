import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import updateAvatar from './config/upload';
import './database';
import AppError from './errors/AppError';

const app = express();
app.use(express.json());
app.use('/files', express.static(updateAvatar.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started!');
});
