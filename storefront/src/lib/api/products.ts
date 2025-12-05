// src/lib/api/products.ts
import { shopifyFetch } from "@/lib/shopifyFetch";
import type { ProductCardProps } from "@/components/product/ProductCard";

// Money type aligned with Shopify Storefront
export type Money = {
  amount: string;
  currencyCode: string;
};

// Minimal product shape used in grids/cards
export type Product = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange?: { maxVariantPrice: Money } | null;
  variants?: {
    edges: { node: { sku: string | null } }[];
  } | null;
};

// GraphQL types
type ProductEdge = {
  node: Product;
};

type CollectionByHandleResponse = {
  collectionByHandle: {
    id: string;
    title: string;
    products: {
      edges: ProductEdge[];
    };
  } | null;
};

const GQL_COLLECTION_PRODUCTS = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            availableForSale
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  sku
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch products for a given collection handle and map them to ProductCardProps
 * @param handle Shopify collection handle (e.g., "destacados")
 * @param first Number of products to fetch (default: 12)
 */
export async function getCollectionProducts(
  handle: string,
  first: number = 12
): Promise<{
  collectionId: string | null;
  collectionTitle: string | null;
  items: ProductCardProps[];
}> {
  const data = await shopifyFetch<CollectionByHandleResponse>(
    GQL_COLLECTION_PRODUCTS,
    { handle, first }
  );

  const collection = data.collectionByHandle;
  const edges = collection?.products?.edges ?? [];

  const items: ProductCardProps[] = edges.map(({ node }) => {
    const price = node.priceRange.minVariantPrice;
    const compareAt = node.compareAtPriceRange?.maxVariantPrice ?? null;

    const sku =
      node.variants?.edges?.[0]?.node?.sku &&
      node.variants.edges[0].node.sku !== ""
        ? node.variants.edges[0].node.sku
        : null;

    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      featuredImage: node.featuredImage ?? null,
      price,
      compareAtPrice: compareAt,
      availableForSale: node.availableForSale,
      sku,
      // badge opcional: ejemplo si quieres marcar cuando hay descuento
      badge:
        compareAt && Number(compareAt.amount) > Number(price.amount)
          ? "Oferta"
          : null,
    };
  });

  return {
    collectionId: collection?.id ?? null,
    collectionTitle: collection?.title ?? null,
    items,
  };
}
