"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react";
import MobileNavDrawer from "./MobileNavDrawer";

// Result type for predictive search suggestions
type ProductResult = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  variants?: {
    edges: {
      node: {
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }[];
  };
};

type HeaderPrimaryProps = {
  menuItems?: { id: string; title: string; url: string }[];
};

export default function HeaderPrimary({ menuItems = [] }: HeaderPrimaryProps) {
  const [q, setQ] = useState("");

  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);
  const resultsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Debounced search function (memoized once)
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        setLoading(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          const json = (await res.json()) as { products: ProductResult[] };
          setResults(json.products || []);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    if (q.length < 3) {
      // No synchronous setState here; just cancel any pending search
      debouncedSearch.cancel();
      return;
    }
    debouncedSearch(q);
    return () => {
      debouncedSearch.cancel();
    };
  }, [q, debouncedSearch]);

  return (
    <div className="mx-auto max-w-container px-4 py-3 sm:py-4">
      <div className="grid grid-cols-12 items-center gap-3">
        <div className="col-span-6 sm:col-span-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="https://cdn.shopify.com/s/files/1/0428/3357/6102/files/TechZone_logo.webp?v=1722963991"
              alt="TechZone"
              className="h-8 sm:h-9"
            />
          </Link>
        </div>

        {/* Search con futura integración predictiva */}
        <div className="col-span-12 sm:col-span-6 order-last sm:order-none">
          <form
            role="search"
            aria-label="Buscar productos"
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: Navegar a /search?q=...
              window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }}
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos…"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              role="combobox"
              aria-expanded={
                q.length >= 3 && (loading || results.length > 0) ? true : false
              }
              aria-activedescendant={
                activeIndex >= 0 ? `option-product-${activeIndex}` : undefined
              }
              autoComplete="off"
              className="w-full rounded-tz border border-tz-border bg-white px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-tz-primary"
              onKeyDown={(e) => {
                if (results.length === 0) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((prev) => (prev + 1) % results.length);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((prev) =>
                    prev <= 0 ? results.length - 1 : prev - 1
                  );
                } else if (e.key === "Enter" && activeIndex >= 0) {
                  e.preventDefault();
                  const activeLink = resultsRef.current[activeIndex];
                  if (activeLink) window.location.href = activeLink.href;
                } else if (e.key === "Escape") {
                  setResults([]);
                  setActiveIndex(-1);
                }
              }}
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"
            >
              <Search className="h-5 w-5 text-tz-muted" />
            </button>
          </form>
          <div
            aria-live="polite"
            aria-label="Sugerencias de búsqueda"
            className={`absolute mt-1 w-full bg-white shadow-tz rounded-tz border border-tz-border z-50 ${
              q.length >= 3 && (loading || results.length > 0)
                ? "block"
                : "hidden"
            }`}
            id="search-suggestions"
            role="listbox"
          >
            {loading && (
              <p className="px-4 py-2 text-sm text-tz-muted">Buscando…</p>
            )}
            {!loading &&
              results.map((p, i) => (
                <a
                  key={p.id}
                  href={`/products/${p.handle}`}
                  id={`option-product-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  ref={(el) => {
                    resultsRef.current[i] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseMove={() => setActiveIndex(i)}
                  className={`flex items-center gap-3 px-4 py-2 ${
                    i === activeIndex
                      ? "bg-tz-bg-soft text-tz-primary"
                      : "hover:bg-tz-bg-soft"
                  }`}
                >
                  <img
                    src={p.featuredImage?.url}
                    alt={p.featuredImage?.altText || p.title}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-tz-fg">{p.title}</p>
                    {p.variants?.edges?.[0]?.node?.price && (
                      <p className="text-xs text-tz-muted">
                        ${p.variants.edges[0].node.price.amount}{" "}
                        {p.variants.edges[0].node.price.currencyCode}
                      </p>
                    )}
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-6 sm:col-span-3 ml-auto flex items-center justify-end gap-3 sm:gap-4">
          <a
            href="/account"
            aria-label="Cuenta"
            className="p-2 hover:bg-tz-bg-soft rounded-full"
          >
            <User className="h-6 w-6 text-tz-fg" />
          </a>

          <a
            href="/cart"
            aria-label="Carrito"
            className="relative p-2 hover:bg-tz-bg-soft rounded-full"
          >
            <ShoppingCart className="h-6 w-6 text-tz-fg" />
            {/* Badge (placeholder, luego dinámico) */}
            <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-tz-primary text-white text-xs grid place-items-center px-1">
              0
            </span>
          </a>

          <MobileNavDrawer menuItems={menuItems} />
        </div>
      </div>
    </div>
  );
}
