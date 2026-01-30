import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, TrendingUp, Heart, Users, Clock } from "lucide-react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const donors = [
  {
    name: "Tim Houldey",
    amount: 30,
    recent: true,
    avatar: "/avatars/tim.png",
  },
  {
    name: "Clive Forrester",
    amount: 10000,
    top: true,
    avatar: "/avatars/clive.png",
  },
  {
    name: "Michael Angus",
    amount: 100,
    time: "11 mins",
    avatar: "/avatars/michael.png",
  },
  {
    name: "Anonymous",
    amount: 100,
    time: "6 mins",
    avatar: "",
  },
  {
    name: "Adel Khalil",
    amount: 93,
    time: "29 mins",
    avatar: "/avatars/adel.png",
  },
];

export default function DonationPanel() {
  const [progress, setProgress] = useState(0);
  const targetProgress = 51;
  const [imageError, setImageError] = useState({});
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [liveCount, setLiveCount] = useState(774);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  const quickAmounts = [500, 1000, 2500, 5000];

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animate live count
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  return (
    <Card className="p-6 rounded-3xl shadow-xl bg-[var(--card)] min-h-[600px] relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--primary)]/5 pointer-events-none" />
      
      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 transition-transform hover:scale-105">
            <CircularProgressbar
              value={progress}
              text={`${Math.round(progress)}%`}
              strokeWidth={12}
              styles={buildStyles({
                pathColor: "var(--primary)",
                trailColor: "var(--muted)",
                textColor: "var(--foreground)",
                strokeLinecap: "round",
                pathTransitionDuration: 1.5,
              })}
            />
          </div>

          <div className="flex-1 pt-2">
            <p className="text-2xl font-bold text-[var(--foreground)] mb-1">
              ₹101,945 raised
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mb-2">
              of ₹200,000 goal
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                1.5K donations
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                15 days left
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full hover:bg-[var(--accent)]/10 relative"
          >
            <Share2 className="h-5 w-5" />
            {showShareMenu && (
              <div className="absolute top-12 right-0 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-2 w-48 z-20">
                <button className="w-full text-left px-3 py-2 hover:bg-[var(--accent)]/10 rounded text-sm">
                  Copy link
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[var(--accent)]/10 rounded text-sm">
                  Share on Twitter
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-[var(--accent)]/10 rounded text-sm">
                  Share on Facebook
                </button>
              </div>
            )}
          </Button>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          {/* CAMPAIGN SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Select Campaign
            </label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-full rounded-full py-6 text-base border-2 hover:border-[var(--primary)]/50 transition-colors">
                <SelectValue placeholder="Choose a cause" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disaster">🌊 Disaster Relief</SelectItem>
                <SelectItem value="education">📚 Education</SelectItem>
                <SelectItem value="health">🏥 Health Care</SelectItem>
                <SelectItem value="ngo">🤝 LGBTQ</SelectItem>
                <SelectItem value="ngo">🤝 NGO Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* QUICK AMOUNT SELECTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Choose Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`rounded-full py-5 transition-all ${
                    selectedAmount === amount
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] scale-105"
                      : "hover:border-[var(--primary)]/50"
                  }`}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-full px-4 py-3 rounded-full border-2 border-[var(--border)] 
                       focus:border-[var(--primary)] focus:outline-none
                       bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>

          {/* DONATE CTA */}
          <Button
            disabled={!selectedAmount && !customAmount}
            className="w-full rounded-full py-6 text-base bg-[var(--primary)] 
                     text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Donate {selectedAmount ? `₹${selectedAmount}` : customAmount ? `₹${customAmount}` : "now"}
          </Button>
        </div>

        {/* LIVE COUNT */}
        <div className="mt-8 flex items-center gap-2 text-[var(--accent-green)] 
                      font-medium bg-[var(--accent-green)]/10 px-4 py-3 rounded-full
                      animate-pulse">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">
            {liveCount} people have just made a donation
          </span>
        </div>

        {/* SECTION HEADER */}
        <div className="mt-8 mb-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Supporters
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Join these amazing donors
          </p>
        </div>

        {/* DONOR LIST */}
        <ul className="space-y-2">
          {donors.map((d, i) => {
            const showFallback = !d.avatar || imageError[i];
            const initial = d.name.charAt(0).toUpperCase();

            return (
              <li
                key={i}
                className="flex items-center justify-between px-3 py-3
                         rounded-xl hover:bg-[var(--accent)]/5 
                         transition-all cursor-pointer group
                         border border-transparent hover:border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  {/* AVATAR */}
                  {showFallback ? (
                    <div
                      className="h-11 w-11 rounded-full flex items-center justify-center
                                  bg-[var(--accent-cyan-light)]
                                  text-[var(--accent-cyan-foreground)]
                                  font-semibold text-base
                                  group-hover:scale-110 transition-transform"
                    >
                      {initial}
                    </div>
                  ) : (
                    <img
                      src={d.avatar}
                      alt={d.name}
                      onError={() =>
                        setImageError((p) => ({ ...p, [i]: true }))
                      }
                      className="h-11 w-11 rounded-full object-cover
                               group-hover:scale-110 transition-transform
                               ring-2 ring-transparent group-hover:ring-[var(--primary)]/20"
                    />
                  )}

                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {d.name}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <span className="font-semibold text-[var(--primary)]">
                        ₹{d.amount}
                      </span>
                      {d.time && (
                        <>
                          <span>•</span>
                          <span>{d.time} ago</span>
                        </>
                      )}
                      {d.recent && (
                        <>
                          <span>•</span>
                          <span className="text-[var(--accent-green)]">
                            Just now
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {d.top && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold
                               bg-gradient-to-r from-yellow-400 to-yellow-500
                               text-yellow-900 shadow-sm
                               group-hover:scale-110 transition-transform"
                  >
                    ⭐ TOP
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full rounded-full py-5 border-2 
                     hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]
                     transition-all"
          >
            See all {donors.length}+ donors
          </Button>
          
          <div className="text-center text-xs text-[var(--muted-foreground)] pt-2">
            💚 Every contribution makes a difference
          </div>
        </div>
      </div>
    </Card>
  );
}