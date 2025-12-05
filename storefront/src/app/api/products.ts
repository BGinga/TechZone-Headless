// src/lib/api/products.ts
import { shopifyFetch } from "../../lib/graphql-client";
import type { Product, ProductConnection } from "../../lib/types/product";

// Fragmento reusable
const PRODUCT_CARD_FIELDS = `
  id
  title
  handle
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
`;

// 4.1 Listado (paginado opcional)
export async function getProducts(
  first = 12,
  after?: string
): Promise<{ items: Product[]; endCursor?: string; hasNextPage: boolean }> {
  const query = `
    query Products($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            ${PRODUCT_CARD_FIELDS}
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  const data = await shopifyFetch<{ products: ProductConnection }>(query, {
    first,
    after,
  });
  const conn = data.products;
  return {
    items: conn.edges.map((e) => e.node),
    endCursor: conn.pageInfo?.endCursor,
    hasNextPage: Boolean(conn.pageInfo?.hasNextPage),
  };
}

// 4.2 Detalle por handle
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        featuredImage { url altText width height }
        images(first: 10) { edges { node { url altText width height } } }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ product: Product | null }>(
    query,
    { handle },
    120
  );
  return data.product ?? null;
}

// 4.3 Búsqueda simple
export async function searchProducts(queryText: string, first = 12) {
  const query = `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<{ products: ProductConnection }>(
    query,
    { query: queryText, first },
    60
  );
  return data.products.edges.map((e) => e.node);
}
