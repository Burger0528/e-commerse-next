import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/lib/types";

const COLLECTION = "users";

export type AuthError = "email_taken" | "invalid_credentials" | "user_not_found";

export interface AuthResult {
  ok: true;
  user: { id: string; name: string; email: string };
}

export interface AuthFailure {
  ok: false;
  error: AuthError;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult | AuthFailure> {
  const db = await getDb();
  const col = db.collection<UserDocument>(COLLECTION);

  const existing = await col.findOne({ email: email.toLowerCase() });
  if (existing) return { ok: false, error: "email_taken" };

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await col.insertOne({
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  } as UserDocument);

  return {
    ok: true,
    user: { id: result.insertedId.toString(), name, email: email.toLowerCase() },
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult | AuthFailure> {
  const db = await getDb();
  const col = db.collection<UserDocument>(COLLECTION);

  const user = await col.findOne({ email: email.toLowerCase() });
  if (!user) return { ok: false, error: "invalid_credentials" };

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { ok: false, error: "invalid_credentials" };

  return {
    ok: true,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}
