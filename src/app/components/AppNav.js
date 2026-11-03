"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/todos", label: "Todos", description: "Quick checklist" },
  { href: "/tasks", label: "Tasks", description: "Full board" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 rounded-2xl border border-light-border bg-light-bg px-4 py-3 shadow-custom-shadow backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="min-w-0">
          <p className="bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            Productivity Hub
          </p>
          <p className="text-xs text-white/60">
            Switch between a simple list and a full task board
          </p>
        </Link>

        <nav className="grid min-w-0 grid-cols-2 gap-1 rounded-xl border border-dark-border bg-dark-bg p-1 sm:min-w-[340px]">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`min-w-0 rounded-lg px-2 py-2 text-center transition-all duration-300 sm:px-4 ${
                  active
                    ? "border border-white/30 bg-gradient-to-br from-white/25 via-cyan-200/20 to-white/5 text-white shadow-[0_0_24px_rgba(0,255,255,0.18)]"
                    : "border border-transparent text-white/70 hover:border-white/15 hover:bg-btn-hover hover:text-white"
                }`}
              >
                <span className="block text-sm font-medium">{link.label}</span>
                <span className="block text-[11px] leading-tight text-white/60">{link.description}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
