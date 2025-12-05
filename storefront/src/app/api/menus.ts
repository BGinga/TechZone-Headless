import { shopifyFetch } from "../../lib/shopifyFetch";
import type { MenuItem } from "../../lib/types/menu";

export async function getMenu(handle = "main-menu"): Promise<MenuItem[]> {
  const query = `
    query Menu($handle: String!) {
      menu(handle: $handle) {
        id
        title
        items {
          id
          title
          url
          items {
            id
            title
            url
            items {
              id
              title
              url
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    menu: { id: string; title: string; items: MenuItem[] };
  }>(query, { handle });

  // Debug server-side to confirm depth
  console.log(
    "🧭 getMenu(%s): %d root items",
    handle,
    data.menu?.items?.length ?? 0
  );
  if (data.menu?.items) {
    for (const it of data.menu.items) {
      const childCount = Array.isArray(it.items) ? it.items.length : 0;
      console.log("  • %s → %d children", it.title, childCount);
    }
  }

  return data.menu?.items ?? [];
}
