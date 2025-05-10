import { CreateUser, Database, UpdateUser, User } from '../types/user';
import * as uuid from 'uuid';
import database from '../db/database';

export class UsersController {
  database: Promise<Database> = database;

  async getUsers(): Promise<User[]> {
    return await this.database.then((database) => database.users);
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.database.then((database) =>
      database.users.find((user) => user.id === id)
    );
    return user || null;
  }

  async addUser(user: CreateUser): Promise<User> {
    const newUser: User = {
      id: uuid.v4(),
      ...user,
    };
    await this.database.then((database) => database.users.push(newUser));
    return newUser;
  }

  async updateUser(updateUser: UpdateUser, id: string): Promise<User | null> {
    const user = await this.getUser(id);
    if (!user) return null;
    else return Object.assign(user, updateUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUser(id);
    if (user) {
      await this.database.then(
        (database) => (database.users = [...database.users.filter((user) => user.id !== id)])
      );
      return true;
    }
    return false;
  }
}

const usersController = new UsersController();
Object.freeze(usersController);

export default usersController;
