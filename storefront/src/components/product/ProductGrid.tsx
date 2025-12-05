// src/components/product/ProductGrid.tsx
import ProductCard from "./ProductCard";
import { getCollectionProducts } from "@/lib/api/products";

export default async function ProductGrid({
  handle,
  title,
  first = 12,
  showSeeMore = false,
}: {
  handle: string;
  title?: string;
  first?: number; // cantidad inicial a traer (home: 12, collections: 24/36)
  showSeeMore?: boolean; // si true, muestra un botón "Ver más" que duplica el first
}) {
  const { items, collectionTitle } = await getCollectionProducts(handle, first);

  const heading = title ?? collectionTitle ?? "Productos";

  // Construye un href simple que duplica la cantidad solicitada para mejorar el paginado por querystring
  // (en página de colecciones se recomienda leer ?first= de searchParams y pasarlo a este componente)
  const nextFirst = Math.min(first * 2, 60); // tope razonable
  const seeMoreHref = `/collections/${handle}?first=${nextFirst}`;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-tz-fg">
          {heading}
        </h2>
        {showSeeMore && items.length >= first && (
          <a
            href={seeMoreHref}
            className="text-sm font-medium text-tz-primary hover:underline"
          >
            Ver más
          </a>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-tz-muted">No hay productos en esta colección.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <li key={p.id}>
              <ProductCard {...p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
