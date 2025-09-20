const BASE = import.meta.env.VITE_API_URL || '';
async function get(path){ const res = await fetch(`${BASE}${path}`, { headers:{'Accept':'application/json'} }); if(!res.ok) throw new Error(await res.text()); return res.json(); }

// Helper to fetch municipality ObjectId by slug
async function getMunicipalityId(slug = 'demo') {
  const res = await get(`/api/municipalities?slug=${slug}`);
  return res && res._id ? res._id : slug;
}

export const api = {
  getMunicipalityId,
  summary: async (municipalityId) => get(`/api/dashboard/summary?municipalityId=${municipalityId}`),
  zones: async (municipalityId) => get(`/api/zones?municipalityId=${municipalityId}`),
  facilities: async (municipalityId) => get(`/api/facilities?municipalityId=${municipalityId}`),
  payments: async (municipalityId,limit=10) => get(`/api/payments/recent?municipalityId=${municipalityId}&limit=${limit}`),
  alerts: async (municipalityId,limit=20) => get(`/api/alerts?municipalityId=${municipalityId}&limit=${limit}`),
};
