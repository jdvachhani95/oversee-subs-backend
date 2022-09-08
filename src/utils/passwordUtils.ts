const bcrypt = require('bcrypt');

export const encodePassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error(error.message);
  }
};
export const comparePassword = async (
  registeredPassword: string,
  enteredPassword: string,
) => {
  try {
    const isSame = await bcrypt.compare(enteredPassword, registeredPassword);
    return isSame;
  } catch (error) {
    console.error(error.message);
  }
};
