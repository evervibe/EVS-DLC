const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:30089';

const Endpoints = {
  counts: {
    items:       `${API_BASE}/data/t_item/count`,
    skills:      `${API_BASE}/data/t_skill/count`,
    skilllevels: `${API_BASE}/data/t_skilllevel/count`,
    strings:     `${API_BASE}/data/t_string/count`,
  },
  list: {
    items:       `${API_BASE}/data/t_item`,
    skills:      `${API_BASE}/data/t_skill`,
    skilllevels: `${API_BASE}/data/t_skilllevel`,
    strings:     `${API_BASE}/data/t_string`,
  },
} as const;

async function get(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const body = await res.json();
  // Handle wrapped response format: { success: true, data: { count: X } }
  if (body?.data?.count !== undefined) return body.data.count;
  // Handle direct response format: { count: X }
  if (body?.count !== undefined) return body.count;
  return 0;
}

export async function getCounts() {
  const [items, skills, skilllevels, strings] = await Promise.all([
    get(Endpoints.counts.items),
    get(Endpoints.counts.skills),
    get(Endpoints.counts.skilllevels),
    get(Endpoints.counts.strings),
  ]);
  return { items, skills, skilllevels, strings };
}
