"use server";

import { getSession } from "@/lib/session";
import { addToCart, removeFromCart, updateQuantity } from "@/services/cartService";

export async function addToCartAction(productId: string): Promise<void> {
  const session = await getSession();
  if (!session.userId) throw new Error("Unauthorized");
  await addToCart(session.userId, productId);
}

export async function removeFromCartAction(productId: string): Promise<void> {
  const session = await getSession();
  if (!session.userId) throw new Error("Unauthorized");
  await removeFromCart(session.userId, productId);
}

export async function updateQuantityAction(productId: string, quantity: number): Promise<void> {
  const session = await getSession();
  if (!session.userId) throw new Error("Unauthorized");
  if (quantity < 1) return;
  await updateQuantity(session.userId, productId, quantity);
}
