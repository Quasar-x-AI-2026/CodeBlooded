export const API_BASE = import.meta.env.VITE_SERVER_URL;

export async function fetchNGOs() {
  const res = await fetch(`${API_BASE}/api/v1/ngo`);
  if (!res.ok) throw new Error("Failed to fetch NGOs");
  return res.json();
}
