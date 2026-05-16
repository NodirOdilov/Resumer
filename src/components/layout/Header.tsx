"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

const NAV_ITEMS = [
  "Резюме",
  "CV",
  "Сопроводительное",
  "Поиск работы",
  "Собеседования",
  "Карьерные советы",
  "О нас",
] as const;

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white transition-shadow duration-200",
          scrolled && "shadow-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D47A1]">
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "#0D47A1" }}>
              Resumer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item}
                className="relative"
                onMouseEnter={() => setActiveMegaMenu(item)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  type="button"
                  className={cn(
                    "px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#0D47A1] rounded-md",
                    activeMegaMenu === item && "text-[#0D47A1]"
                  )}
                >
                  {item}
                </button>
                {activeMegaMenu === item && (
                  <MegaMenu
                    item={item}
                    onClose={() => setActiveMegaMenu(null)}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/account" className="hidden lg:block">
              <Button>Личный кабинет</Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
