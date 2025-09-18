import argon2 from "argon2";

export async function hashPassword(password: string) {
  const secret = process.env.ARGON2_SECRET!;
  return await argon2.hash(password, { secret: Buffer.from(secret) });
}

export async function verifyPassword(password: string, hash: string) {
    const secret = process.env.ARGON2_SECRET!;
  return await argon2.verify(hash, password, { secret: Buffer.from(secret) });
}

