export default function DonationHero() {
  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-b-2xl">
      <img
        src="/images/disater-relief-feeding.jpg"
        alt="Crisis relief"
        className="absolute inset-0 h-full w-full object-cover "
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-10">
        <h1 className="text-3xl font-semibold text-white">
          Donate to Crisis Relief
        </h1>
      </div>
    </div>
  );
}
