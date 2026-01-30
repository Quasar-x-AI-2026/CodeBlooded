import { useState } from "react";
import {
  Clock,
  ShieldCheck,
  HeartHandshake,
  Utensils,
  Stethoscope,
  Users,
  BarChart3,
} from "lucide-react";
import { Quote } from "lucide-react";

export default function AboutDonation() {
  const [activeTab, setActiveTab] = useState("impact");

  return (
    <div className="space-y-10 max-w-3xl">
      {/* HEADER */}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-[var(--foreground)]">
          Why your donation matters
        </h2>
        <div className="h-1 w-20 rounded-full bg-[var(--primary)]/80" />
        <p className="text-base text-[var(--muted-foreground)] max-w-2xl">
          During crises, speed and coordination determine outcomes. Your
          contribution enables rapid, verified, and data-driven relief where it
          is needed most.
        </p>
      </div>

      {/* KEY REASONS */}
      <div className="grid gap-4">
        <InfoBlock
          icon={Clock}
          title="Speed saves lives"
          text="Funds are mobilized in real time, enabling rapid deployment of food, medical supplies, and response teams during the most critical first hours."
        />
        <InfoBlock
          icon={ShieldCheck}
          title="Verified and accountable"
          text="Every NGO and campaign on this platform is verified. Donations are tracked and directed based on real-time crisis intelligence."
        />
      </div>

      {/* TABS */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {/* TAB HEADERS */}
        <div className="flex border-b border-[var(--border)] bg-[var(--secondary)]">
          <TabButton
            active={activeTab === "impact"}
            onClick={() => setActiveTab("impact")}
            label="What your donation does"
          />
          <TabButton
            active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
            label="Impact so far"
          />
        </div>

        {/* TAB CONTENT */}
        <div className="p-6">
          {activeTab === "impact" ? (
            <div className="space-y-4">
              <ImpactItem
                icon={Utensils}
                amount="₹500"
                text="Provides emergency meals for displaced families"
              />
              <ImpactItem
                icon={Stethoscope}
                amount="₹1,000"
                text="Supplies essential medical kits and first-aid resources"
              />
              <ImpactItem
                icon={Users}
                amount="₹2,000"
                text="Supports deployment of trained response teams and volunteers"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Lives impacted" value="12.5M+" />
              <StatCard label="Funds raised" value="₹450Cr+" />
              <StatCard label="Verified NGOs" value="2,800+" />
              <StatCard label="Successful responses" value="98%" />
            </div>
          )}
        </div>
        
      </div>
      {/* SURVIVOR TESTIMONIAL */}

<div className="relative rounded-2xl border border-[var(--border)] bg-[var(--accent-cyan-lighter)] p-8 overflow-hidden">
  {/* Soft background accent */}
  <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[var(--accent-cyan-light)] opacity-60" />

  <div className="relative space-y-5">
    {/* Quote icon */}
    <div className="h-12 w-12 rounded-full bg-[var(--accent-cyan-light)] flex items-center justify-center">
      <Quote className="h-5 w-5 text-[var(--accent-cyan-foreground)]" />
    </div>

    {/* Testimonial text */}
    <p className="text-lg leading-relaxed text-[var(--foreground)]">
      After the floods destroyed our village in Assam, we lost our home, our
      crops, and everything we depended on. Within 48 hours, relief teams reached
      us with food, medicines, and temporary shelter. That support helped us
      survive and begin rebuilding our lives.
    </p>

    {/* Author */}
    <div className="pt-2 border-t border-[var(--border)]">
      <p className="font-semibold text-[var(--foreground)]">
        Rajesh Kumar
      </p>
      <p className="text-sm text-[var(--muted-foreground)]">
        Flood survivor, Assam
      </p>
    </div>
  </div>
</div>


    </div>
  );
}

/* ---------- INTERNAL UI BLOCKS ---------- */

function InfoBlock({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <Icon className="h-5 w-5 text-[var(--primary)] mt-1" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {title}
        </p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function ImpactItem({ icon: Icon, amount, text }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      <Icon className="h-4 w-4 text-[var(--primary)] mt-1" />
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
        <span className="font-medium text-[var(--foreground)]">
          {amount}
        </span>{" "}
        {text}
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className="text-xl font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-5 py-3 text-sm font-medium transition ${
        active
          ? "bg-[var(--card)] text-[var(--foreground)] border-b-2 border-[var(--primary)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
