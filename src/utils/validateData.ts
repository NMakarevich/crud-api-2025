export function isValidData(data: string) {
  try {
    const user = JSON.parse(data);
    if (!user || typeof user !== 'object') return false;
    if (!('username' in user) || typeof user.username !== 'string') return false;
    if (!('age' in user) || typeof user.age !== 'number') return false;
    return !(
      !('hobbies' in user) ||
      !Array.isArray(user.hobbies) ||
      user.hobbies.some((hobby: unknown) => typeof hobby !== 'string')
    );
  } catch {
    return false;
  }
}
