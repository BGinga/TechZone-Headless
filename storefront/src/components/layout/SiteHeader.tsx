import TopBar from "./TopBar";
import HeaderPrimary from "./HeaderPrimary";
import NavDesktop from "./NavDesktop";
import { getMenu } from "@/app/api/menus";

export default async function SiteHeader() {
  const menuItems = await getMenu("main-menu");

  return (
    <header
      className="sticky top-0 z-50 w-full bg-tz-bg/95 backdrop-blur supports-[backdrop-filter]:bg-tz-bg/80 border-b border-tz-border"
      role="banner"
      data-menu-count={menuItems?.length ?? 0}
    >
      <TopBar />
      <HeaderPrimary menuItems={menuItems} />
      <NavDesktop items={menuItems} />
    </header>
  );
}
