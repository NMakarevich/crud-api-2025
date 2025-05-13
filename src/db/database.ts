import { Database } from '../types/user';

const database: Database = {
  users: [],
};

export default new Promise<Database>((resolve) => resolve(database));
