import http from 'node:http';
import { handleRequest } from '../utils/requestHandler';
import { MESSAGES } from '../constants/constants';
import { CreateUser, UpdateUser } from '../types/user';

let server: http.Server;

beforeAll(() => {
  server = http.createServer();
  server.on('request', async (req, res) => {
    await handleRequest(req, res);
  });
  server.listen(5000);
});

afterAll(() => {
  server.close();
});

describe('API', () => {
  const baseUrl = 'http://localhost:5000';
  let userId = '';
  const body: CreateUser = {
    username: 'Test',
    age: 30,
    hobbies: [],
  };

  it('Should return empty array of users', async () => {
    const response = await fetch(`${baseUrl}/api/users`);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(0);
  });
  it('Should return 404 for invalid endpoint', async () => {
    const response = await fetch(`${baseUrl}/api`);
    expect(response.status).toBe(404);
    const data = await response.text();
    expect(data).toEqual(MESSAGES.URL_NOT_FOUND);
  });
  it('Should create new user', async () => {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    userId = data.id;
    expect(data.username).toEqual(body.username);
    expect(data.age).toEqual(body.age);
    expect(data.hobbies.length).toEqual(body.hobbies.length);
  });

  it('Should return user by id', async () => {
    const response = await fetch(`${baseUrl}/api/users/${userId}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toEqual(userId);
    expect(data.username).toEqual(body.username);
    expect(data.age).toEqual(body.age);
    expect(data.hobbies.length).toEqual(body.hobbies.length);
  });
  it('Should return 400 if invalid user id', async () => {
    const response = await fetch(`${baseUrl}/api/users/invaild-id`);
    expect(response.status).toBe(400);
    const data = await response.text();
    expect(data).toEqual(MESSAGES.INVALID_UUID);
  });
  it('Should update user', async () => {
    const updateBody: UpdateUser = {
      ...body,
      age: 27,
    };
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateBody),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.username).toEqual(body.username);
    expect(data.age).toBe(updateBody.age);
    expect(data.hobbies.length).toEqual(body.hobbies.length);
  });
  it('Should delete user by id', async () => {
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: 'DELETE',
    });
    expect(response.status).toBe(204);
  });
  it('Should return 404 if user with id is not found', async () => {
    const response = await fetch(`${baseUrl}/api/users/${userId}`);
    expect(response.status).toBe(404);
    const data = await response.text();
    expect(data).toEqual(MESSAGES.USER_NOT_FOUND);
  });
});
