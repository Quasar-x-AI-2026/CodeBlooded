import CountUp from "@/components/CountNumber";

const variants = {
  cyan: {
    bg: "var(--accent-cyan-light)",
    border: "var(--accent-cyan)",
    bar: "var(--accent-cyan)",
    iconBg: "var(--accent-cyan-lighter)",
    icon: "🌐",
    glow: "var(--accent-cyan)",
    // Network/Connection map nodes
    svg: (
      <svg
        className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Map grid */}
        <path d="M20 50 L180 50 M20 80 L180 80 M20 110 L180 110 M20 140 L180 140" 
              stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <path d="M50 20 L50 180 M80 20 L80 180 M110 20 L110 180 M140 20 L140 180" 
              stroke="currentColor" strokeWidth="1" opacity="0.3" />
        
        {/* Connection nodes */}
        <circle cx="60" cy="70" r="8" fill="currentColor" opacity="0.4" />
        <circle cx="120" cy="90" r="12" fill="currentColor" opacity="0.5" />
        <circle cx="90" cy="130" r="6" fill="currentColor" opacity="0.3" />
        <circle cx="150" cy="60" r="10" fill="currentColor" opacity="0.4" />
        
        {/* Connection lines */}
        <path d="M60 70 L120 90 L90 130 M120 90 L150 60" 
              stroke="currentColor" strokeWidth="2" opacity="0.3" strokeDasharray="4 4" />
        
        {/* Map pin markers */}
        <path d="M60 70 L60 55 M60 55 C60 50 65 50 65 55 C65 60 60 65 60 70" 
              fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  blue: {
    bg: "var(--accent-blue-light)",
    border: "var(--accent-blue)",
    bar: "var(--accent-blue)",
    iconBg: "var(--accent-blue-lighter)",
    icon: "⚠️",
    glow: "var(--accent-blue)",
    // Crisis zones with alert ripples
    svg: (
      <svg
        className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Map outline */}
        <path d="M40 60 L70 50 L100 55 L130 45 L160 60 L170 90 L165 130 L140 155 L100 160 L60 150 L35 120 L40 80 Z" 
              stroke="currentColor" strokeWidth="2" opacity="0.3" />
        
        {/* Alert zones (concentric circles) */}
        <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
        <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="100" cy="100" r="56" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        
        {/* Alert triangles */}
        <path d="M100 85 L108 100 L92 100 Z" fill="currentColor" opacity="0.4" />
        <circle cx="100" cy="103" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  green: {
    bg: "var(--accent-green-light)",
    border: "var(--accent-green)",
    bar: "var(--accent-green)",
    iconBg: "var(--accent-green-lighter)",
    icon: "💰",
    glow: "var(--accent-green)",
    // Money flow/distribution network
    svg: (
      <svg
        className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central hub */}
        <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="3" opacity="0.4" fill="currentColor" fillOpacity="0.1" />
        
        {/* Distribution nodes */}
        <circle cx="60" cy="60" r="12" fill="currentColor" opacity="0.35" />
        <circle cx="140" cy="60" r="12" fill="currentColor" opacity="0.35" />
        <circle cx="60" cy="140" r="12" fill="currentColor" opacity="0.35" />
        <circle cx="140" cy="140" r="12" fill="currentColor" opacity="0.35" />
        <circle cx="100" cy="40" r="10" fill="currentColor" opacity="0.3" />
        <circle cx="100" cy="160" r="10" fill="currentColor" opacity="0.3" />
        
        {/* Flow lines with arrows */}
        <path d="M100 80 L100 60 M100 120 L100 150" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        <path d="M85 85 L65 65 M115 85 L135 65" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        <path d="M85 115 L65 135 M115 115 L135 135" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
        
        {/* Arrow heads */}
        <path d="M95 65 L100 60 L105 65" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" />
        <path d="M60 55 L60 60 L65 60" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" />
        <path d="M135 60 L140 60 L140 65" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none" />
      </svg>
    ),
  },
  indigo: {
    bg: "var(--accent-indigo-light)",
    border: "var(--accent-indigo)",
    bar: "var(--accent-indigo)",
    iconBg: "var(--accent-indigo-lighter)",
    icon: "👥",
    glow: "var(--accent-indigo)",
    // Population density heatmap
    svg: (
      <svg
        className="absolute -right-8 -top-8 w-48 h-48 opacity-[0.05] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Map regions */}
        <path d="M30 50 L80 40 L130 60 L170 50 L180 100 L160 140 L120 160 L70 150 L30 120 Z" 
              stroke="currentColor" strokeWidth="2" opacity="0.3" fill="currentColor" fillOpacity="0.08" />
        
        {/* Population clusters (varying sizes) */}
        <circle cx="70" cy="80" r="18" fill="currentColor" opacity="0.3" />
        <circle cx="130" cy="90" r="25" fill="currentColor" opacity="0.35" />
        <circle cx="90" cy="130" r="15" fill="currentColor" opacity="0.25" />
        <circle cx="140" cy="120" r="20" fill="currentColor" opacity="0.3" />
        
        {/* People icons simplified */}
        <circle cx="70" cy="75" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="80" cy="78" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="75" cy="85" r="4" fill="currentColor" opacity="0.5" />
        
        <circle cx="130" cy="85" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="140" cy="88" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="125" cy="95" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="135" cy="97" r="4" fill="currentColor" opacity="0.5" />
        
        {/* Location markers */}
        <path d="M90 125 L90 115 C90 112 93 112 93 115 C93 118 90 122 90 125" 
              fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
};

export default function KPICard({
  label,
  value,
  prefix = "",
  suffix = "",
  variant = "cyan",
}) {
  const v = variants[variant];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[fadeUp_0.6s_ease-out]"
      style={{
        backgroundColor: v.bg,
        borderColor: v.border,
        boxShadow: `0 10px 30px -10px ${v.glow}33`,
      }}
    >
      {/* Background SVG (decorative) */}
      <div style={{ color: v.glow }}>
        {v.svg}
      </div>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1.5 rounded-r"
        style={{ backgroundColor: v.bar }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
          style={{ 
            backgroundColor: v.iconBg,
            boxShadow: `0 2px 8px ${v.glow}20`
          }}
        >
          {v.icon}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {label}
          </p>

          <p
            className="text-3xl font-bold flex items-baseline gap-1"
            style={{ color: "var(--card-foreground)" }}
          >
            {prefix && <span className="text-2xl">{prefix}</span>}

            {typeof value === "number" ? (
              <CountUp
                from={0}
                to={value}
                duration={2}
                separator=","
                className="tracking-tight"
              />
            ) : (
              <span className="tracking-tight">{value}</span>
            )}

            {suffix && <span className="text-xl font-semibold">{suffix}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}