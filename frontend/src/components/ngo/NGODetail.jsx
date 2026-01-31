import { Button } from "@/components/ui/button";

export default function NGODetail({ ngo, onViewReports }) {
  if (!ngo) return null;

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-2xl font-bold text-foreground">
        {ngo.name}
      </h2>

      <p className="text-muted-foreground">{ngo.about}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Type:</strong> {ngo.type}
        </div>
        <div>
          <strong>NGO Code:</strong> {ngo.NGOcode}
        </div>
        <div>
          <strong>Email:</strong> {ngo.email}
        </div>
        <div>
          <strong>Phone:</strong> {ngo.phone}
        </div>
        <div className="col-span-2">
          <strong>Address:</strong> {ngo.address}
        </div>
        {ngo.website && (
          <div className="col-span-2">
            <strong>Website:</strong>{" "}
            <a
              href={ngo.website}
              target="_blank"
              className="text-primary underline"
            >
              {ngo.website}
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <p className="font-semibold">
          Current Fund: ₹ {ngo.currentFund.toLocaleString()}
        </p>

        <Button onClick={onViewReports}>
          View Reports
        </Button>
      </div>
    </div>
  );
}
