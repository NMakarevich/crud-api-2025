import * as uuid from 'uuid';

export const isValidId = (id: string) => {
  return uuid.validate(id);
};
