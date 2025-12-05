// src/lib/graphql-client.ts
import { SHOPIFY_DOMAIN, SHOPIFY_TOKEN } from "./env";

type GraphQLResponse<T> = { data: T; errors?: { message: string }[] };

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidateSeconds = 120
): Promise<T> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: revalidateSeconds },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify fetch error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join(" | ")}`
    );
  }
  return json.data;
}
