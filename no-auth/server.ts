import * as restify from 'restify';
import {postMessages} from './app/routes';

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

server.post('/api/messages', postMessages);

export default server;
