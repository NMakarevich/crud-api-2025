export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type CreateUser = {
  username: string;
  age: number;
  hobbies: string[];
};

export type UpdateUser = CreateUser;

export type Database = {
  users: User[];
};
