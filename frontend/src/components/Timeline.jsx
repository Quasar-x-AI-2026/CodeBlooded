export default function Timeline() {
  const items = [
    { name: "UN OCHA", amount: "$100,000", time: "1 hour ago" },
    { name: "Tata Trusts", amount: "$50,000", time: "2 hours ago" },
    { name: "Ayush Patel", amount: "$15,000", time: "8 hours ago" },
  ];

  return (
    <section className="px-6 mt-8 overflow-hidden">
      <h3
        className="text-sm font-medium mb-3"
        style={{ color: "var(--muted-foreground)" }}
      >
        Timeline
      </h3>

      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 w-max animate-loop">
          {[...items, ...items].map((item, i) => (
            <div
              key={i}
              className="w-[260px] flex-shrink-0 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                boxShadow:
                  "0 14px 35px -14px oklch(0.2 0.02 260 / 0.22)",
              }}
            >
              <p
                className="font-medium"
                style={{ color: "var(--card-foreground)" }}
              >
                {item.name}
              </p>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: "var(--card-foreground)" }}
              >
                {item.amount}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes loop {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-loop {
          animation: loop 18s linear infinite;
        }
      `}</style>
    </section>
  );
}
