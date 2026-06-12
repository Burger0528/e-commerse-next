import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Product, ProductDetail, ProductDocument } from "@/lib/types";

const COLLECTION = "products";

function toProduct(doc: ProductDocument): Product {
  const { extendedDescription: _, specifications: __, _id, createdAt, ...rest } = doc;
  return { ...rest, _id: _id.toString(), createdAt: createdAt.toISOString() };
}

function toProductDetail(doc: ProductDocument): ProductDetail {
  const { _id, createdAt, ...rest } = doc;
  return { ...rest, _id: _id.toString(), createdAt: createdAt.toISOString() };
}

export async function listProducts(): Promise<Product[]> {
  const db = await getDb();
  const docs = await db
    .collection<ProductDocument>(COLLECTION)
    .find(
      {},
      {
        projection: {
          extendedDescription: 0,
          specifications: 0,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(toProduct);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (objectIds.length === 0) return [];

  const db = await getDb();
  const docs = await db
    .collection<ProductDocument>(COLLECTION)
    .find(
      { _id: { $in: objectIds } },
      { projection: { extendedDescription: 0, specifications: 0 } }
    )
    .toArray();

  return docs.map(toProduct);
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();
  const doc = await db
    .collection<ProductDocument>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!doc) return null;
  return toProductDetail(doc);
}
