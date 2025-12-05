// src/lib/shopifyFetch.ts
const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN!;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // cache 60s para evitar sobrecarga
  });

  if (!response.ok)
    throw new Error(`Shopify GraphQL error: ${response.statusText}`);

  const json = await response.json();
  return json.data;
}
