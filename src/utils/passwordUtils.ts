import { genSaltSync, hashSync, compareSync } from 'bcrypt-nodejs';

export const encodePassword = (password: string) => {
  try {
    const salt = genSaltSync();
    const hash = hashSync(password, salt);
    return hash;
  } catch (error) {
    console.error(error.message);
  }
};
export const comparePassword = (
  registeredPassword: string,
  enteredPassword: string,
) => {
  try {
    const isSame = compareSync(enteredPassword, registeredPassword);
    return isSame;
  } catch (error) {
    console.error(error.message);
  }
};
