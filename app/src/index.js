// @flow

import Koa from 'koa';

const app: Koa = new Koa();
const port: number = parseInt(process.env.PORT, 10) || 3000;

app.use(ctx => {
  ctx.body = 'Hello World!';
});

app.listen(port);
