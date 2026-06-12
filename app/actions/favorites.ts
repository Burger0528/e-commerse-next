"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { toggleFavorite } from "@/services/favoritesService";

export async function toggleFavoriteAction(productId: string): Promise<boolean> {
  const session = await getSession();
  if (!session.userId) throw new Error("Unauthorized");

  const isNowFavorited = await toggleFavorite(session.userId, productId);

  revalidatePath("/", "layout");

  return isNowFavorited;
}
