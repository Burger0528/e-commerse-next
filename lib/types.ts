import { ObjectId } from "mongodb";

// ─── users ────────────────────────────────────────────────────────────────────

export interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// ─── products ─────────────────────────────────────────────────────────────────

export interface ProductSpecification {
  label: string;
  value: string;
}

/** Fields present in both list and detail views */
export interface ProductBase {
  _id: ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  shortDescription: string;
  stock: number;
  createdAt: Date;
}

/** Full document stored in MongoDB (includes detail-only fields) */
export interface ProductDocument extends ProductBase {
  extendedDescription: string;
  specifications: ProductSpecification[];
}

/** Serializable version (ObjectId → string, Date → string) returned by services */
export interface Product extends Omit<ProductBase, "_id" | "createdAt"> {
  _id: string;
  createdAt: string;
}

export interface ProductDetail extends Omit<ProductDocument, "_id" | "createdAt"> {
  _id: string;
  createdAt: string;
}

// ─── cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: ObjectId;
  quantity: number;
}

export interface CartDocument {
  _id: ObjectId;
  userId: ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

/** Serializable cart item with joined product data — returned by cartService */
export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

// ─── favorites ────────────────────────────────────────────────────────────────

export interface FavoritesDocument {
  _id: ObjectId;
  userId: ObjectId;
  productIds: ObjectId[];
  updatedAt: Date;
}

// ─── sales ────────────────────────────────────────────────────────────────────

export interface SaleItem {
  productId: ObjectId;
  quantity: number;
  priceAtSale: number;
}

export type SaleStatus = "pending" | "confirmed" | "shipped" | "cancelled";

export interface SaleDocument {
  _id: ObjectId;
  userId: ObjectId;
  items: SaleItem[];
  total: number;
  status: SaleStatus;
  createdAt: Date;
}
