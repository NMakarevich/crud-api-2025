import * as http from 'node:http';

import 'dotenv/config';
import { handleRequest } from './utils/requestHandler';

const port = process.env.PORT || '3000';

const server = http.createServer({ requestTimeout: 5000 });
server.listen(parseInt(port));

server.on('request', async (request, response) => {
  await handleRequest(request, response);
});
console.log(`Server started on port ${port}...\n`);
