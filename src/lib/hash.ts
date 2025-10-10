import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const secret = process.env.HASH_SECRET ?? "";
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);
  const toHash = secret ? password + secret : password;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(toHash, salt);
}

export async function verifyPassword(password: string, hash: string) {
  const secret = process.env.HASH_SECRET ?? "";
  const toVerify = secret ? password + secret : password;
  return await bcrypt.compare(toVerify, hash);
}
