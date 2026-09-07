import ArticleCard from "@/components/ArticleCard";
import { getArticles, groupByDay } from "@/lib/articles";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Advisories // CYBREWS",
};

export default async function AdvisoriesPage() {
  const articles = await getArticles({ severity: "info" });
  const grouped = groupByDay(articles);
  const days = Object.keys(grouped);

  return (
    <>
      <div className="pt-12 pb-6">
        <h1 className="font-mono font-bold text-[28px] sm:text-[34px] tracking-tight">
          Advisories
        </h1>
        <p className="mt-3 max-w-[560px] text-muted text-[15px] leading-relaxed">
          Official advisories and lower-severity reports — vendor patches,
          CISA notices, and research writeups that aren&apos;t active
          incidents.
        </p>
      </div>

      {days.length === 0 && (
        <p className="text-muted text-sm py-10">
          No advisories yet — check back after the next feed update.
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
