import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, X, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RaiseIssue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "disaster",
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImages = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const reportText = `${form.title}. ${form.description}. Location: ${form.location}. Type: ${form.type}`;

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/crisis/process-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: reportText,
            source: "User Report",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.data?.status === "created") {
          toast.success("Crisis issue created successfully! NGOs will be notified.");
          setForm({ title: "", description: "", location: "", type: "disaster" });
          setImages([]);
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          toast.info("Report analyzed - No immediate crisis detected. Thank you for reporting!");
          setForm({ title: "", description: "", location: "", type: "disaster" });
          setImages([]);
        }
      } else {
        toast.error(data.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const issueTypes = [
    { value: "disaster", label: "🌊 Natural Disaster (Flood, Earthquake, Cyclone)" },
    { value: "disease", label: "🦠 Disease Outbreak / Epidemic" },
    { value: "accident", label: "🚗 Major Accident" },
    { value: "fire", label: "🔥 Fire Emergency" },
    { value: "infrastructure", label: "🏗️ Infrastructure Collapse" },
    { value: "violence", label: "⚠️ Violence / Riot" },
    { value: "missing", label: "🔍 Missing Persons" },
    { value: "other", label: "📋 Other Emergency" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <style>{`
        .label-with-underline {
          position: relative;
          display: inline-block;
        }

        .label-with-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-green);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .label-with-underline:hover::after {
          width: 100%;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(34, 197, 94, 0.2);
        }
      `}</style>

      <Card className="w-full max-w-5xl p-8 space-y-6 card card-hover">
        {/* HEADER */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-green-lighter)" }}
          >
            <AlertTriangle className="w-7 h-7" style={{ color: "var(--accent-green)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Report an Emergency
            </h1>
            <p className="text-sm text-muted-foreground">
              Help NGOs respond quickly by providing accurate details
            </p>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT – IMAGE DROP ZONE */}
          <label
            className="
              relative rounded-2xl cursor-pointer overflow-hidden
              border-2 border-dashed
              flex flex-col items-center justify-center
              transition-all duration-300
              hover:shadow-lg
              hover:scale-[1.005]
              min-h-[420px]
            "
            style={{
              borderColor: "var(--accent-green)",
              backgroundColor: "var(--accent-green-lighter)",
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => handleImages(e.target.files)}
            />

            {images.length === 0 ? (
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: "var(--accent-green-light)" }}
                >
                  <UploadCloud className="w-10 h-10" style={{ color: "var(--accent-green)" }} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Upload Evidence
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drop images or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 p-3 grid grid-cols-2 gap-2 bg-background/90 backdrop-blur-sm overflow-y-auto">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-video">
                    <img
                      src={img.preview}
                      className="h-full w-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(img.id);
                      }}
                      className="
                        absolute top-2 right-2
                        bg-destructive text-white
                        rounded-full p-1
                        opacity-0 group-hover:opacity-100
                        transition-opacity
                      "
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {/* Add more button */}
                <div 
                  className="aspect-video rounded-xl border-2 border-dashed flex items-center justify-center transition-colors"
                  style={{ borderColor: "var(--accent-green-light)" }}
                >
                  <div className="text-center">
                    <UploadCloud className="w-6 h-6 mx-auto" style={{ color: "var(--accent-green)" }} />
                    <p className="text-xs text-muted-foreground mt-1">Add more</p>
                  </div>
                </div>
              </div>
            )}
          </label>

          {/* RIGHT – FORM */}
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold label-with-underline">
                Issue Title *
              </Label>
              <Input
                placeholder="e.g. Severe flooding near central market"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold label-with-underline">
                Description *
              </Label>
              <Textarea
                rows={4}
                placeholder="Describe the situation in detail - what's happening, how many people affected, current conditions..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="resize-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold label-with-underline">
                Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Area, city, landmark, or pin code"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {/* Issue Type Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold label-with-underline">
                Issue Type
              </Label>
              <Select
                value={form.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="
                w-full h-12 text-base font-semibold
                text-white
                rounded-xl
                transition-all duration-200
                hover:shadow-lg
                hover:brightness-110
                disabled:opacity-50
              "
              style={{
                backgroundColor: "var(--accent-green)",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Submit Report
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              AI will analyze your report and notify relevant NGOs automatically
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}