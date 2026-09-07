const TAG_STYLES = {
  critical: "bg-red/10 text-red border-red/30",
  high: "bg-amber/10 text-amber border-amber/30",
  info: "bg-cyan/10 text-cyan border-cyan/25",
};

const TAG_LABEL = {
  critical: "CRITICAL",
  high: "HIGH",
  info: "ADVISORY",
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ArticleCard({ article }) {
  return (
    <div className="bg-panel border border-line rounded-md px-5 py-4 mb-3 transition hover:border-[#33445A] hover:translate-x-[2px]">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          className={`font-mono text-[10px] font-bold tracking-wide px-2 py-[3px] rounded border ${
            TAG_STYLES[article.severity]
          }`}
        >
          {TAG_LABEL[article.severity]}
        </span>
        <span className="font-mono text-xs text-muted2">
          {formatTime(article.published_at)}
        </span>
      </div>

      <h3 className="text-[16.5px] font-semibold leading-snug mb-1.5">
        {article.title}
      </h3>
      <p className="text-[13.5px] text-muted leading-relaxed max-w-[640px]">
        {article.summary}
      </p>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-line">
        <div className="flex items-center gap-2 text-[12.5px] text-muted2">
          <span className="w-1.5 h-1.5 bg-muted2 rounded-sm" />
          {article.source}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-cyan border-b border-cyan/35 hover:border-cyan pb-px"
        >
          Read source →
        </a>
      </div>
    </div>
  );
}
