import http from 'node:http';
import { User } from '../types/user.ts';

export function sendResponse({
  res,
  code,
  data,
  message,
  error,
}: {
  res: http.ServerResponse;
  code: number;
  data?: User | User[];
  message?: string;
  error?: unknown;
}) {
  res.writeHead(code);
  if (data) res.write(JSON.stringify(data));
  if (message) res.write(message);
  if (error && error instanceof Error) {
    res.write(`Error: ${error.message}`);
  }
  res.end();
}
