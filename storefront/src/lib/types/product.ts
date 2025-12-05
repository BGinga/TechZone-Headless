// src/lib/types/product.ts
export type Money = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type PriceRange = { minVariantPrice: Money; maxVariantPrice?: Money };

export type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  featuredImage?: ShopifyImage | null;
  images?: { edges: { node: ShopifyImage }[] };
  priceRange: PriceRange;
};

export type ProductEdge = { node: Product };
export type ProductConnection = {
  edges: ProductEdge[];
  pageInfo?: { hasNextPage: boolean; endCursor?: string };
};
