import Link from "next/link";
import { getSourceSummaries } from "@/lib/articles";
import { SOURCE_LINKS } from "@/lib/sourceLinks";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sources // CYBREWS",
};

function formatLatest(iso) {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SourcesPage() {
  const sources = await getSourceSummaries();

  return (
    <>
      <div className="pt-12 pb-6">
        <h1 className="font-mono font-bold text-[28px] sm:text-[34px] tracking-tight">
          Sources
        </h1>
        <p className="mt-3 max-w-[560px] text-muted text-[15px] leading-relaxed">
          Outlets currently feeding into CYBREWS, pulled twice daily via RSS.
          Click a source to visit its site.
        </p>
      </div>

      {sources.length === 0 && (
        <p className="text-muted text-sm py-10">
          No source data yet — run the ingestion script to populate the feed.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        {sources.map((s) => {
          const homepage = SOURCE_LINKS[s.source];
          return (
            <div
              key={s.source}
              className="bg-panel border border-line rounded-md px-5 py-4 hover:border-[#33445A] transition"
            >
              <div className="flex items-center justify-between">
                {homepage ? (
                  <a
                    href={homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15.5px] font-semibold hover:text-cyan"
                  >
                    {s.source} ↗
                  </a>
                ) : (
                  <h3 className="text-[15.5px] font-semibold">{s.source}</h3>
                )}
                <span className="font-mono text-[11px] text-cyan bg-cyan/10 border border-cyan/25 rounded px-2 py-[2px]">
                  {s.count} {s.count === 1 ? "story" : "stories"}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] text-muted2 font-mono">
                Last update: {formatLatest(s.latest)}
              </p>
              <Link
                href={`/?source=${encodeURIComponent(s.source)}`}
                className="mt-3 inline-block font-mono text-xs text-cyan border-b border-cyan/35 hover:border-cyan pb-px"
              >
                View in feed →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}