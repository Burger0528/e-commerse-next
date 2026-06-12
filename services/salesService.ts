import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { SaleDocument, SaleItem, CartItemWithProduct } from "@/lib/types";

const COLLECTION = "sales";

export async function createSale(userId: string, items: CartItemWithProduct[]): Promise<string> {
  const saleItems: SaleItem[] = items.map((item) => ({
    productId: new ObjectId(item.productId),
    quantity: item.quantity,
    priceAtSale: item.product.price,
  }));

  const total = saleItems.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);

  const db = await getDb();
  const result = await db.collection<SaleDocument>(COLLECTION).insertOne({
    userId: new ObjectId(userId),
    items: saleItems,
    total,
    status: "pending",
    createdAt: new Date(),
  } as SaleDocument);

  return result.insertedId.toString();
}
