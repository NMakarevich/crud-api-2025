import http from 'node:http';
import usersController from '../controllers/users.ts';
import { isValidId } from './validateId.ts';
import { isValidData } from './validateData.ts';

export async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    if (!req.url || !req.url.startsWith('/api/user')) {
      res.writeHead(404);
      res.write('404 Not Found');
      res.end();
    } else {
      const method = req.method;
      switch (method) {
        case 'GET':
          await methodGet(req, res);
          break;
        case 'POST':
          await methodPost(req, res);
          break;
        case 'PUT':
          await methodPut(req, res);
          break;
        case 'DELETE':
          await methodDelete(req, res);
          break;
        default:
          res.writeHead(400);
          res.write('Invalid method');
          res.end();
      }
    }
  } catch (error: unknown) {
    res.writeHead(500);
    res.write('Internal Server Error');
    if (error instanceof Error) {
      res.write(`Error: ${error.message}`);
    }
    res.end();
  }
}

async function methodGet(req: http.IncomingMessage, res: http.ServerResponse) {
  const { url } = req;
  const id = url?.split('/api/users').pop()?.slice(1);
  if (!id) {
    const users = await usersController.getUsers();
    res.writeHead(200);
    res.write(JSON.stringify(users));
    res.end();
  } else if (!isValidId(id)) {
    res.writeHead(400);
    res.write('User id is not valid uuid');
    res.end();
  } else {
    const user = await usersController.getUser(id);
    if (!user) {
      res.writeHead(404);
      res.write('User is not found');
      res.end();
    } else {
      res.writeHead(200);
      res.write(JSON.stringify(user));
      res.end();
    }
  }
}

async function methodPut(req: http.IncomingMessage, res: http.ServerResponse) {
  const { url } = req;
  const id = url?.split('/api/users').pop()?.slice(1);
  if (!id || !isValidId(id)) {
    res.writeHead(400);
    res.write(`User id is not valid uuid`);
    res.end();
  } else {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        if (!isValidData(data)) {
          res.writeHead(400);
          res.write(
            'Invalid request body.\nBody should contain username: string, age: number, hobbies: string[].'
          );
          res.end();
        } else {
          const updatedUser = JSON.parse(data);
          const result = await usersController.updateUser(updatedUser, id);
          if (result) {
            res.writeHead(200);
            res.write(JSON.stringify(result));
            res.end();
          } else {
            res.writeHead(404);
            res.write('User is not found');
            res.end();
          }
        }
      } catch (error) {
        res.writeHead(500);
        res.write('Internal server error\n');
        if (error instanceof Error) {
          res.write('Error: ' + error.message);
        }
        res.end();
      }
    });
  }
}
async function methodPost(req: http.IncomingMessage, res: http.ServerResponse) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', async () => {
    try {
      if (!isValidData(data)) {
        res.writeHead(400);
        res.write(
          'Invalid request body.\nBody should contain username: string, age: number, hobbies: string[].'
        );
        res.end();
      } else {
        const user = JSON.parse(data);
        const result = await usersController.addUser(user);
        res.writeHead(201);
        res.write(JSON.stringify(result));
        res.end();
      }
    } catch (error) {
      res.writeHead(500);
      res.write('Internal server error\n');
      if (error instanceof Error) {
        res.write('Error: ' + error.message);
      }
      res.end();
    }
  });
}
async function methodDelete(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const { url } = req;
    const id = url?.split('/api/users').pop()?.slice(1);
    if (!id || !isValidId(id)) {
      res.writeHead(400);
      res.write(`User id is not valid uuid`);
      res.end();
    } else {
      const isDeleted = await usersController.deleteUser(id);
      if (isDeleted) {
        res.writeHead(204);
        res.write('User delete successfully');
        res.end();
      } else {
        res.writeHead(404);
        res.write('User is not found');
        res.end();
      }
    }
  } catch (error) {
    res.writeHead(500);
    res.write('Internal server error\n');
    if (error instanceof Error) {
      res.write('Error: ' + error.message);
    }
    res.end();
  }
}
