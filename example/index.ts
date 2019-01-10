import * as express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import * as bodyParser from 'body-parser';
import { resolve } from 'path';
import { typeDefs } from './types';
import { resolvers } from './resolvers';

// Sofa

import { useSofa, OpenAPI } from '../src';

const app = express();

app.use(bodyParser.json());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const openApi = OpenAPI({
  schema,
  info: {
    title: 'Example API',
    version: '3.0.0',
  },
});

app.use(
  '/api',
  useSofa({
    schema,
    ignore: ['User.favoriteBook'],
    onRoute(info) {
      openApi.addRoute(info);
    },
  })
);

openApi.save(resolve(__dirname, './swagger.yml'));

const port = 4000;

app.listen(port, () => {
  const url = `http://localhost:${4000}`;

  console.log(`
    Queries:
      me:           ${url}/api/me
      users:        ${url}/api/users
      user:         ${url}/api/user/1
  `);
});
