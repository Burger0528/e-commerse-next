import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { FavoritesDocument, Product } from "@/lib/types";
import { getProductsByIds } from "./productService";

const COLLECTION = "favorites";

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const db = await getDb();
  const doc = await db
    .collection<FavoritesDocument>(COLLECTION)
    .findOne({ userId: new ObjectId(userId) }, { projection: { productIds: 1 } });
  return doc?.productIds.map((id) => id.toString()) ?? [];
}

export async function getFavoriteProducts(userId: string): Promise<Product[]> {
  const ids = await getFavoriteIds(userId);
  return getProductsByIds(ids);
}

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const db = await getDb();
  const col = db.collection<FavoritesDocument>(COLLECTION);
  const uid = new ObjectId(userId);
  const pid = new ObjectId(productId);

  const existing = await col.findOne({ userId: uid }, { projection: { productIds: 1 } });

  if (!existing) {
    await col.insertOne({ userId: uid, productIds: [pid], updatedAt: new Date() } as FavoritesDocument);
    return true;
  }

  const alreadyFavorited = existing.productIds.some((id) => id.equals(pid));

  if (alreadyFavorited) {
    await col.updateOne(
      { userId: uid },
      { $pull: { productIds: pid }, $set: { updatedAt: new Date() } }
    );
    return false;
  }

  await col.updateOne(
    { userId: uid },
    { $addToSet: { productIds: pid }, $set: { updatedAt: new Date() } }
  );
  return true;
}
