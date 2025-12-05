"use client";

import Link from "next/link";

type Money = {
  amount: string; // decimal as string from Shopify
  currencyCode: string; // e.g. MXN, USD
};

type Image = {
  url: string;
  altText?: string | null;
};

export type ProductCardProps = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: Image | null;
  // Pricing (use minVariantPrice for cards)
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale?: boolean;
  // Variant SKU (first variant)
  sku?: string | null;
  // Optional extra badge (e.g. "Nuevo")
  badge?: string | null;
  // Optional click handler to integrate Cart later
  onAddToCart?: () => void;
};

function formatCurrency(m: Money | undefined | null): string {
  if (!m) return "";
  const value = Number.parseFloat(m.amount);
  if (Number.isNaN(value)) return `${m.amount} ${m.currencyCode}`;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: m.currencyCode || "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductCard({
  id,
  handle,
  title,
  featuredImage,
  price,
  compareAtPrice,
  availableForSale = true,
  sku,
  badge,
  onAddToCart,
}: ProductCardProps) {
  const hasDiscount = !!(
    compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount)
  );
  const discountPct = hasDiscount
    ? Math.round(
        (1 - Number(price.amount) / Number(compareAtPrice!.amount)) * 100
      )
    : 0;

  return (
    <article
      data-id={id}
      className="group rounded-2xl border border-tz-border bg-tz-bg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Media */}
      <Link href={`/products/${handle}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-tz-bg-soft">
          {featuredImage?.url ? (
            <img
              src={featuredImage.url}
              alt={featuredImage.altText ?? title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-tz-muted">
              Sin imagen
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {hasDiscount && (
              <span className="inline-flex items-center rounded-full bg-red-600 text-white px-2 py-0.5 text-[11px] font-semibold shadow">
                Oferta · -{discountPct}%
              </span>
            )}
            {badge ? (
              <span className="inline-flex items-center rounded-full bg-black/70 text-white px-2 py-0.5 text-[11px] font-medium">
                {badge}
              </span>
            ) : null}
            {!availableForSale && (
              <span className="inline-flex items-center rounded-full bg-zinc-800 text-white px-2 py-0.5 text-[11px] font-medium">
                Agotado
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        <Link href={`/products/${handle}`} className="block min-h-[2.5rem]">
          <h3 className="line-clamp-2 text-sm font-medium text-tz-fg group-hover:text-tz-primary transition-colors">
            {title}
          </h3>
          {sku ? (
            <p className="mt-0.5 text-[11px] text-tz-muted">SKU: {sku}</p>
          ) : null}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-tz-fg">
            {formatCurrency(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-tz-muted line-through">
              {formatCurrency(compareAtPrice!)}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {onAddToCart ? (
            <button
              type="button"
              onClick={onAddToCart}
              disabled={!availableForSale}
              className="inline-flex items-center justify-center rounded-full border border-tz-border px-3 py-1.5 text-sm font-medium text-tz-fg hover:bg-tz-bg-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableForSale ? "Agregar" : "Agotado"}
            </button>
          ) : (
            <Link
              href={`/products/${handle}`}
              className="inline-flex items-center justify-center rounded-full border border-tz-border px-3 py-1.5 text-sm font-medium text-tz-fg hover:bg-tz-bg-soft"
            >
              Ver producto
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
