import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { CartDocument, CartItemWithProduct } from "@/lib/types";
import { getProductsByIds } from "./productService";

const COLLECTION = "cart";

export async function addToCart(userId: string, productId: string): Promise<void> {
  const db = await getDb();
  const col = db.collection(COLLECTION);
  const uid = new ObjectId(userId);
  const pid = new ObjectId(productId);

  const result = await col.updateOne(
    { userId: uid, "items.productId": pid },
    { $inc: { "items.$.quantity": 1 }, $set: { updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    await col.updateOne(
      { userId: uid },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $push: { items: { productId: pid, quantity: 1 } } as any, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }
}

export async function removeFromCart(userId: string, productId: string): Promise<void> {
  const db = await getDb();
  const uid = new ObjectId(userId);
  const pid = new ObjectId(productId);

  await db.collection(COLLECTION).updateOne(
    { userId: uid },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { $pull: { items: { productId: pid } } as any, $set: { updatedAt: new Date() } }
  );
}

export async function updateQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  const db = await getDb();
  const uid = new ObjectId(userId);
  const pid = new ObjectId(productId);

  await db.collection(COLLECTION).updateOne(
    { userId: uid, "items.productId": pid },
    { $set: { "items.$.quantity": quantity, updatedAt: new Date() } }
  );
}

export async function clearCart(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId: new ObjectId(userId) },
    { $set: { items: [], updatedAt: new Date() } }
  );
}

export async function getCartWithProducts(userId: string): Promise<CartItemWithProduct[]> {
  const db = await getDb();
  const cartDoc = await db
    .collection<CartDocument>(COLLECTION)
    .findOne({ userId: new ObjectId(userId) });

  if (!cartDoc || cartDoc.items.length === 0) return [];

  const productIds = cartDoc.items.map((item) => item.productId.toString());
  const products = await getProductsByIds(productIds);
  const productMap = new Map(products.map((p) => [p._id, p]));

  return cartDoc.items
    .filter((item) => productMap.has(item.productId.toString()))
    .map((item) => ({
      productId: item.productId.toString(),
      quantity: item.quantity,
      product: productMap.get(item.productId.toString())!,
    }));
}
