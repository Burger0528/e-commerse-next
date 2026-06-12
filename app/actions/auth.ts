"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { registerUser, loginUser } from "@/services/authService";
import { sendWelcomeEmail } from "@/lib/email";

export type ActionState = {
  error?: string;
} | undefined;

export async function registerAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "es";

  if (!name || name.length < 2) return { error: "name_short" };
  if (!email || !email.includes("@")) return { error: "email_invalid" };
  if (!password || password.length < 6) return { error: "password_short" };

  const result = await registerUser(name, email, password);
  if (!result.ok) return { error: result.error };

  const session = await getSession();
  session.userId = result.user.id;
  session.name = result.user.name;
  session.email = result.user.email;
  await session.save();

  await sendWelcomeEmail(result.user.name, result.user.email).catch((e) =>
    console.error("[email] Welcome email failed:", e)
  );

  redirect(`/${locale}`);
}

export async function loginAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "es";

  if (!email || !password) return { error: "fields_required" };

  const result = await loginUser(email, password);
  if (!result.ok) return { error: result.error };

  const session = await getSession();
  session.userId = result.user.id;
  session.name = result.user.name;
  session.email = result.user.email;
  await session.save();

  redirect(`/${locale}`);
}

export async function logoutAction(locale: string = "es") {
  const session = await getSession();
  session.destroy();
  redirect(`/${locale}`);
}
