"use client";

import Link from "next/link";
import MegaMenu from "./MegaMenu";

type MenuItem = {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
};

export default function NavDesktop({
  items = [] as MenuItem[],
}: {
  items?: MenuItem[];
}) {
  return (
    <nav
      className="hidden md:block border-t border-tz-border bg-tz-bg overflow-visible"
      role="navigation"
      aria-label="Menú principal"
      data-items-count={items?.length ?? 0}
    >
      <div className="max-w-container mx-auto px-4 overflow-visible">
        <ul className="relative flex items-center justify-center gap-6 py-2 text-sm font-medium text-tz-fg overflow-visible">
          {items.length === 0 ? (
            <li className="text-sm text-tz-muted py-2">Menú vacío</li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="relative group z-40 py-2 px-2">
                <Link
                  href={item.url}
                  className="hover:text-tz-primary transition-colors"
                  aria-haspopup={item.items?.length ? "true" : undefined}
                  aria-expanded="false"
                >
                  {item.title}
                </Link>
                {item.items?.length ? (
                  <MegaMenu parentId={item.id} items={item.items} />
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
}
