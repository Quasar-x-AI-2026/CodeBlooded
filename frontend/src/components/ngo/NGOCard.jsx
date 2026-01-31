import { Card } from "@/components/ui/card";

export default function NGOCard({ ngo, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="
        p-5 cursor-pointer space-y-2
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        border border-border
        bg-card
      "
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-semibold text-foreground leading-snug">
          {ngo.name}
        </h3>

        <span
          className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
          style={{
            background: "var(--accent-green-lighter)",
            color: "var(--accent-green-foreground)",
          }}
        >
          {ngo.type}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {ngo.address}
      </p>

      <p className="text-sm font-medium text-foreground pt-1">
        ₹ {ngo.currentFund.toLocaleString()} available
      </p>
    </Card>
  );
}
