/* @flow */
export default (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return undefined;
};
