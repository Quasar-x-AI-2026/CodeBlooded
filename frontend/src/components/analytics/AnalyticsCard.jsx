export default function AnalyticsCard({ title, children }) {
  return (
    <div
      className="
        rounded-2xl 
        bg-[var(--card)] 
        border border-[var(--border)]
        shadow-sm
        p-8
        min-h-[420px]
        flex flex-col
      "
    >
      {/* Title */}
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      )}

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
