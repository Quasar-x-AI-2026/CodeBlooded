import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NGOCard from "@/components/ngo/NGOCard";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function NGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGO, setSelectedNGO] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/ngo`
        );

        if (!res.ok) throw new Error();

        const json = await res.json();
        setNgos(json.data.ngos || []);
      } catch {
        toast.error("Failed to fetch NGOs");
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">
          Registered NGOs
        </h1>
        <p className="text-muted-foreground">
          Transparent list of verified organizations
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT – NGO LIST */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-muted-foreground">Loading NGOs…</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {ngos.map((ngo) => (
                <NGOCard
                  key={ngo._id}
                  ngo={ngo}
                  onClick={() => setSelectedNGO(ngo)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT – NGO DETAILS PANEL */}
        <div className="hidden lg:block">
          {selectedNGO ? (
            <Card className="p-6 space-y-4 h-full">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {selectedNGO.name}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full inline-block"
                  style={{
                    background: "var(--accent-green-lighter)",
                    color: "var(--accent-green-foreground)",
                  }}
                >
                  {selectedNGO.type}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground">{selectedNGO.address}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-muted-foreground">{selectedNGO.email}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-muted-foreground">{selectedNGO.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">About</p>
                  <p className="text-muted-foreground">{selectedNGO.about || 'No description available'}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Current Funds</p>
                  <p className="text-muted-foreground">₹ {selectedNGO.currentFund?.toLocaleString() || 0}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Website</p>
                  <p className="text-muted-foreground">
                    {selectedNGO.website ? (
                      <a href={selectedNGO.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedNGO.website}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/ngo/${selectedNGO._id}`)}
                className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View Reports
              </button>
            </Card>
          ) : (
            <Card
              className="
                h-full min-h-[180px]
                flex items-center justify-center
                text-muted-foreground
                text-sm
              "
            >
              Select an NGO to view details
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
