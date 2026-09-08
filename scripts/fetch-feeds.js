// Fetches cybersecurity RSS feeds, tags severity by keyword,
// and upserts new articles into Supabase. Run manually with
// `npm run fetch-feeds`, or on a schedule via GitHub Actions.

require("dotenv").config({ path: ".env.local" });
const Parser = require("rss-parser");
const { createClient } = require("@supabase/supabase-js");

const parser = new Parser();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key, server-side only
);

// Add or remove feeds here.
const FEEDS = [
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer" },
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security" },
  { url: "https://www.darkreading.com/rss.xml", source: "Dark Reading" },
  { url: "https://therecord.media/feed/", source: "The Record" },
];

const CRITICAL_KEYWORDS = ["zero-day", "zero day", "actively exploited", "critical vulnerability"];
const HIGH_KEYWORDS = ["ransomware", "breach", "exploit", "supply chain", "data leak"];

function classifySeverity(text) {
  const lower = text.toLowerCase();
  if (CRITICAL_KEYWORDS.some((k) => lower.includes(k))) return "critical";
  if (HIGH_KEYWORDS.some((k) => lower.includes(k))) return "high";
  return "info";
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

async function fetchFeed({ url, source }) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => {
      const summary = stripHtml(item.contentSnippet || item.summary || "").slice(0, 280);
      return {
        title: item.title?.trim() ?? "Untitled",
        summary,
        url: item.link,
        source,
        published_at: item.isoDate || item.pubDate || new Date().toISOString(),
        severity: classifySeverity(`${item.title} ${summary}`),
      };
    });
  } catch (err) {
    console.error(`Failed to fetch ${source} (${url}):`, err.message);
    return [];
  }
}

async function main() {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const articles = results.flat().filter((a) => a.url);

  if (articles.length === 0) {
    console.log("No articles fetched.");
    return;
  }

  // Upsert on url so re-running the job doesn't create duplicates.
  // .select() makes Supabase return only the rows actually written —
  // with ignoreDuplicates: true, rows that already existed are NOT
  // returned here, so this gives us a true "new articles" count.
  const { data: inserted, error } = await supabase
    .from("articles")
    .upsert(articles, { onConflict: "url", ignoreDuplicates: true })
    .select("id");

  if (error) {
    console.error("Supabase upsert failed:", error.message);
    process.exit(1);
  }

  const newCount = inserted?.length ?? 0;
  const dupeCount = articles.length - newCount;
  console.log(
    `Checked ${articles.length} articles: ${newCount} new, ${dupeCount} already existed (skipped).`
  );
}

main();
