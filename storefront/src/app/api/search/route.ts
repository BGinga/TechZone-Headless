import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopifyFetch";

interface ProductVariantEdge {
  node: {
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  variants: {
    edges: ProductVariantEdge[];
  };
}

interface SearchResponse {
  products?: {
    edges?: { node: ProductNode }[];
  };
}

const GQL = `
  query searchProducts($query: String!) {
    products(first: 5, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  if (!q || q.length < 3) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  try {
    const data = await shopifyFetch<SearchResponse>(GQL, { query: q });
    const products = data.products?.edges?.map((e) => e.node) ?? [];
    return NextResponse.json(
      { products },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Search error";
    return NextResponse.json(
      { error: true, message, products: [] },
      { status: 500 }
    );
  }
}
