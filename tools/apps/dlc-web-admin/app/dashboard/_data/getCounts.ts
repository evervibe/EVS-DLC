import { serverFetchJSON } from '@/lib/http';

/**
 * Fetch dashboard counts from the DLC API via proxy
 * Uses server-side fetch with absolute URLs to avoid SSR errors
 */
export async function getCounts() {
  const unwrap = async (path: string) => {
    const body = await serverFetchJSON<any>(path);
    // Handle wrapped response format: { success: true, data: { count: X } }
    if (body?.data?.count !== undefined) return body.data.count;
    // Handle direct response format: { count: X }
    if (body?.count !== undefined) return body.count;
    return 0;
  };

  const [items, skills, skilllevels, strings] = await Promise.all([
    unwrap('/api/dlc/data/t_item/count'),
    unwrap('/api/dlc/data/t_skill/count'),
    unwrap('/api/dlc/data/t_skilllevel/count'),
    unwrap('/api/dlc/data/t_string/count'),
  ]);

  return { items, skills, skilllevels, strings };
}
