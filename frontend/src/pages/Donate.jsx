import DonationHero from "@/components/donate/DonationHero";
import DonationPanel from "@/components/donate/DonationPanel";
import AboutDonation from "@/components/donate/AboutDonation";

export default function Donate() {
  return (
    <div className="bg-[var(--background)] min-h-screen relative">
      <DonationHero />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* RIGHT PANEL (OVERLAPS HERO) */}
        <div className="absolute right-6 top-[-50px] w-[480px] z-20">
          <DonationPanel />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-10">
          {/* LEFT ABOUT */}
          <div className="lg:col-span-3">
            <AboutDonation />
          </div>

          {/* EMPTY SPACE FOR SYMMETRY */}
          <div className="lg:col-span-2" />
        </div>
      </div>
    </div>
  );
}
