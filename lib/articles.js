import { supabase } from "@/lib/supabase";

/**
 * Fetch articles, optionally filtered by severity and/or source.
 * severity: "critical" | "high" | "info" | undefined (undefined = all)
 * source: exact source name string | undefined (undefined = all)
 */
export async function getArticles({ severity, source, limit = 50 } = {}) {
  let query = supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (severity) {
    query = query.eq("severity", severity);
  }
  if (source) {
    query = query.eq("source", source);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch articles:", error.message);
    return [];
  }
  return data;
}

export function groupByDay(articles) {
  const groups = {};
  for (const a of articles) {
    const day = new Date(a.published_at).toDateString();
    groups[day] = groups[day] || [];
    groups[day].push(a);
  }
  return groups;
}

/**
 * Fetch a summary per source: article count and most recent publish time.
 * Aggregated in JS since it's a small dataset — no need for a DB view.
 */
export async function getSourceSummaries() {
  const { data, error } = await supabase
    .from("articles")
    .select("source, published_at")
    .order("published_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Failed to fetch sources:", error.message);
    return [];
  }

  const bySource = {};
  for (const row of data) {
    if (!bySource[row.source]) {
      bySource[row.source] = { source: row.source, count: 0, latest: row.published_at };
    }
    bySource[row.source].count += 1;
  }
  return Object.values(bySource).sort((a, b) => b.count - a.count);
}
