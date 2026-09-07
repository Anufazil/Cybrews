"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SEVERITY_OPTIONS = [
  { value: "", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "info", label: "Advisory" },
];

export default function FeedFilters({ sources = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSeverity = searchParams.get("severity") || "";
  const currentSource = searchParams.get("source") || "";

  function buildHref({ severity, source }) {
    const params = new URLSearchParams();
    const sev = severity !== undefined ? severity : currentSeverity;
    const src = source !== undefined ? source : currentSource;
    if (sev) params.set("severity", sev);
    if (src) params.set("source", src);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function handleSourceChange(e) {
    router.push(buildHref({ source: e.target.value }));
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {SEVERITY_OPTIONS.map((opt) => {
        const active = currentSeverity === opt.value;
        return (
          <Link
            key={opt.value || "all"}
            href={buildHref({ severity: opt.value })}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition ${
              active
                ? "bg-cyan/10 text-cyan border-cyan/40"
                : "text-muted border-line hover:border-[#33445A] hover:text-text"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}

      {sources.length > 0 && (
        <select
          value={currentSource}
          onChange={handleSourceChange}
          className="font-mono text-xs px-3 py-1.5 rounded border border-line bg-panel text-muted hover:border-[#33445A] focus:outline-none focus:border-cyan/40 ml-auto"
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {(currentSeverity || currentSource) && (
        <Link
          href={pathname}
          className="font-mono text-xs text-muted2 hover:text-cyan underline"
        >
          Clear
        </Link>
      )}
    </div>
  );
}
