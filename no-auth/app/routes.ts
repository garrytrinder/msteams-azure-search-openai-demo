import app from './app';
import adapter from './adapter';
import {Request, Response} from 'restify';

export const postMessages = async (req: Request, res: Response) => {
  await adapter.process(req, res, async context => {
    await app.run(context);
  });
};
