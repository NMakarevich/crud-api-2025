import http from 'node:http';
import usersController from '../controllers/users.ts';
import { isValidId } from './validateId.ts';
import { isValidData } from './validateData.ts';
import { sendResponse } from './sendResponse.ts';
import { MESSAGES } from '../constants/constants.ts';

export async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    if (!req.url || !req.url.startsWith('/api/user')) {
      sendResponse({ res, code: 404, message: MESSAGES.URL_NOT_FOUND });
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
          sendResponse({ res, code: 400, message: MESSAGES.INVALID_METHOD });
      }
    }
  } catch (error: unknown) {
    sendResponse({ res, code: 500, error, message: MESSAGES.SERVER_ERROR });
  }
}

async function methodGet(req: http.IncomingMessage, res: http.ServerResponse) {
  const { url } = req;
  const id = url?.split('/api/users').pop()?.slice(1);
  if (!id) {
    const users = await usersController.getUsers();
    sendResponse({ res, code: 200, data: users });
  } else if (!isValidId(id)) {
    sendResponse({ res, code: 400, message: MESSAGES.INVALID_UUID });
  } else {
    const user = await usersController.getUser(id);
    if (!user) {
      sendResponse({ res, code: 404, message: MESSAGES.USER_NOT_FOUND });
    } else {
      sendResponse({ res, code: 200, data: user });
    }
  }
}

async function methodPut(req: http.IncomingMessage, res: http.ServerResponse) {
  const { url } = req;
  const id = url?.split('/api/users').pop()?.slice(1);
  if (!id || !isValidId(id)) {
    sendResponse({ res, code: 400, message: MESSAGES.INVALID_UUID });
  } else {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      try {
        if (!isValidData(data)) {
          sendResponse({ res, code: 400, message: MESSAGES.INVALID_BODY });
        } else {
          const updatedUser = JSON.parse(data);
          const result = await usersController.updateUser(updatedUser, id);
          if (result) {
            sendResponse({ res, code: 200, data: result });
          } else {
            sendResponse({ res, code: 404, message: MESSAGES.USER_NOT_FOUND });
          }
        }
      } catch (error) {
        sendResponse({ res, code: 500, message: MESSAGES.SERVER_ERROR, error });
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
        sendResponse({ res, code: 400, message: MESSAGES.INVALID_BODY });
      } else {
        const user = JSON.parse(data);
        const result = await usersController.addUser(user);
        sendResponse({ res, code: 201, data: result });
      }
    } catch (error) {
      sendResponse({ res, code: 500, message: MESSAGES.SERVER_ERROR, error });
    }
  });
}
async function methodDelete(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const { url } = req;
    const id = url?.split('/api/users').pop()?.slice(1);
    if (!id || !isValidId(id)) {
      sendResponse({ res, code: 400, message: MESSAGES.INVALID_UUID });
    } else {
      const isDeleted = await usersController.deleteUser(id);
      if (isDeleted) {
        sendResponse({ res, code: 204 });
      } else {
        sendResponse({ res, code: 404, message: MESSAGES.USER_NOT_FOUND });
      }
    }
  } catch (error) {
    sendResponse({ res, code: 500, message: MESSAGES.SERVER_ERROR, error });
  }
}
