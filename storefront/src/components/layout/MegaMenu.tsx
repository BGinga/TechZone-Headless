"use client";

import Link from "next/link";

type MenuItem = {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
};

type MegaMenuProps = {
  parentId: string;
  items?: { id: string; title: string; url: string }[];
};

export default function MegaMenu({ parentId, items = [] }: MegaMenuProps) {
  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Hover bridge: área invisible para mantener hover estable */}
      <div aria-hidden className="absolute left-0 right-0 top-full h-3" />
      <div
        id={`mega-${parentId}`}
        role="region"
        aria-label="Submenú"
        className={[
          // positioning
          "absolute left-1/2 -translate-x-1/2 top-full mt-2",
          // stacking
          "z-[100]",
          // box
          "w-[900px] max-w-[92vw] rounded-tz bg-white shadow-tz border border-tz-border",
          "p-6 grid grid-cols-2 md:grid-cols-3 gap-6",
          // estado oculto por defecto
          "hidden opacity-0 translate-y-2 pointer-events-none",
          // transición con retardo por defecto (cierre “tolerante”)
          "transition-all duration-200 ease-out delay-150 will-change-transform",
          // al hover/focus del padre mostramos sin retardo (apertura ágil)
          "group-hover:block group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:delay-0",
          "group-focus-within:block group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:delay-0",
        ].join(" ")}
      >
        {items.map((sub) => (
          <div key={sub.id} className="min-w-0">
            <Link
              href={sub.url}
              className="block text-tz-fg font-medium hover:text-tz-primary transition-colors"
            >
              {sub.title}
            </Link>
            <p className="mt-1 text-sm text-tz-muted line-clamp-2">
              Explora {sub.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
