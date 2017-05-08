// @flow

import Koa from 'koa';
import greet from './greet';

const app: Koa = new Koa();
const port: number = parseInt(process.env.PORT, 10) || 3000;

app.use(ctx => {
  ctx.body = greet('World!');
});

app.listen(port);
