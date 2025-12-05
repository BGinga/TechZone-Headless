// src/lib/env.ts
export const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
export const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
  throw new Error(
    "Faltan variables de entorno: SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN"
  );
}
