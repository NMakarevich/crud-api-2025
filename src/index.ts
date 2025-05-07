import * as http from 'node:http';

import 'dotenv/config';

const port = process.env.PORT || '3000';

const server = http.createServer({ requestTimeout: 5000 });

server.listen(parseInt(port));
console.log(`Server started on port ${port}...\n`);
