import NetworkCanvas from "@/components/NetworkCanvas";
import ArticleCard from "@/components/ArticleCard";
import FeedFilters from "@/components/FeedFilters";
import { getArticles, groupByDay, getSourceSummaries } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const severity = searchParams?.severity || undefined;
  const source = searchParams?.source || undefined;

  const [articles, sourceSummaries] = await Promise.all([
    getArticles({ severity, source }),
    getSourceSummaries(),
  ]);

  const grouped = groupByDay(articles);
  const days = Object.keys(grouped);
  const sourceNames = sourceSummaries.map((s) => s.source).sort();

  const critCount = articles.filter((a) => a.severity === "critical").length;
  const sourceCount = new Set(articles.map((a) => a.source)).size;

  return (
    <>
      <div className="relative pt-16 pb-10 md:grid md:grid-cols-[1fr_320px] md:gap-10 md:items-start">
        <div>
          <h1 className="font-mono font-bold text-[32px] sm:text-[40px] leading-[1.15] tracking-tight">
            Today&apos;s threats,
            <br />
            <span className="bg-gradient-to-r from-cyan to-[#7CF5E8] bg-clip-text text-transparent">
              traced to source.
            </span>
          </h1>
          <p className="mt-4 max-w-[460px] text-muted text-[15px] leading-relaxed">
            A daily feed of cybersecurity news pulled from trusted outlets —
            every story links straight back to where it came from.
          </p>
          <div className="flex gap-7 mt-8 pt-6 border-t border-line font-mono">
            <div>
              <div className="text-[22px] font-bold text-cyan">
                {articles.length}
              </div>
              <div className="text-xs text-muted2 mt-0.5">STORIES TODAY</div>
            </div>
            <div>
              <div className="text-[22px] font-bold text-cyan">
                {sourceCount}
              </div>
              <div className="text-xs text-muted2 mt-0.5">SOURCES</div>
            </div>
            <div>
              <div className="text-[22px] font-bold text-cyan">
                {critCount}
              </div>
              <div className="text-xs text-muted2 mt-0.5">CRITICAL</div>
            </div>
          </div>
        </div>
        <NetworkCanvas />
      </div>

      <div className="flex items-baseline justify-between mt-14 mb-4">
        <h2 className="font-mono text-sm font-bold text-muted tracking-wide">
          LATEST
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
          UPDATED 06:00 &amp; 18:00 DAILY
        </div>
      </div>

      <FeedFilters sources={sourceNames} />

      {days.length === 0 && (
        <p className="text-muted text-sm py-10">
          {severity || source
            ? "No articles match this filter."
            : "No articles yet — run the ingestion script to populate the feed."}
        </p>
      )}

      {days.map((day) => (
        <div key={day}>
          <div className="font-mono text-xs text-muted2 mt-7 mb-3 pb-2 border-b border-line">
            {day.toUpperCase()}
          </div>
          {grouped[day].map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ))}
    </>
  );
}