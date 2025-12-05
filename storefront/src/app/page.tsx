// src/app/page.tsx
import { getProducts } from "@/app/api/products";
import type { Product } from "@/lib/types/product";
import { getHomeSlides } from "@/lib/api/home";
import HomeCarousel from "@/components/home/HomeCarousel";
import ProductGrid from "@/components/product/ProductGrid";

export default async function Home() {
  const slides = await getHomeSlides();

  let products: Product[] = [];
  try {
    const { items } = await getProducts(9);
    products = items;
  } catch {
    products = [];
  }

  return (
    <div className="bg-zinc-50 font-sans">
      <main className="flex flex-col items-center w-full min-h-screen bg-white">
        {/* Full width carousel */}
        <section className="w-full">
          <HomeCarousel slides={slides} />
        </section>
        <section className="w-full max-w-5xl py-4 px-6">
          <ProductGrid
            handle="new-lo-mas-nuevo"
            title="¡Lo más nuevo!"
            first={12}
          />
        </section>
        <section className="w-full max-w-5xl py-4 px-6">
          <ProductGrid handle="colors" title="¿Un poco de color?" first={6} />
        </section>
      </main>
    </div>
  );
}
