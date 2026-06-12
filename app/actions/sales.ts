"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getCartWithProducts, clearCart } from "@/services/cartService";
import { createSale } from "@/services/salesService";

export async function checkoutAction(locale: string): Promise<void> {
  const session = await getSession();
  if (!session.userId) throw new Error("Unauthorized");

  const items = await getCartWithProducts(session.userId);
  if (items.length === 0) return;

  await createSale(session.userId, items);
  await clearCart(session.userId);

  revalidatePath("/", "layout");
  redirect(`/${locale}`);
}
