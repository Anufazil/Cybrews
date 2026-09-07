"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Feed" },
  { href: "/advisories", label: "Advisories" },
  { href: "/sources", label: "Sources" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-[22px] border-b border-line">
      <Link
        href="/"
        className="font-mono font-extrabold text-lg flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_#4CE0D2]" />
        CYBREWS
      </Link>
      <div className="flex gap-7 text-[13px]">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "text-cyan"
                  : "text-muted hover:text-cyan transition"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
