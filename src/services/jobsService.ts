import { jobsConfig, JobData, CACHE_KEYS } from '@/config/jobs';

// Cache utilities
const getCachedJobs = (region: string): JobData[] | null => {
  if (!jobsConfig.cacheEnabled) return null;
  
  try {
    const cached = localStorage.getItem(`${CACHE_KEYS.JOBS_PREFIX}${region}`);
    const lastFetch = localStorage.getItem(`${CACHE_KEYS.LAST_FETCH}${region}`);
    
    if (!cached || !lastFetch) return null;
    
    const timeSinceLastFetch = Date.now() - parseInt(lastFetch);
    if (timeSinceLastFetch > jobsConfig.cacheDuration) {
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedJobs = (region: string, jobs: JobData[]): void => {
  if (!jobsConfig.cacheEnabled) return;
  
  try {
    localStorage.setItem(`${CACHE_KEYS.JOBS_PREFIX}${region}`, JSON.stringify(jobs));
    localStorage.setItem(`${CACHE_KEYS.LAST_FETCH}${region}`, Date.now().toString());
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// Fetch jobs from mock JSON. Regions without their own entry (e.g. Bahrain/Oman, which
// don't have sample job data yet) get an empty list rather than another region's jobs
// silently relabeled under the wrong region - see useRegionPricing.ts for the same rule
// applied to pricing.
const fetchMockJobs = async (regionCode: string): Promise<JobData[]> => {
  const response = await fetch('/data/jobs.json');
  if (!response.ok) throw new Error('Failed to fetch mock jobs');

  const data = await response.json();
  return data[regionCode] || [];
};

// Fetch jobs from Adzuna API (via edge function to avoid CORS)
const fetchAdzunaJobs = async (regionCode: string): Promise<JobData[]> => {
  try {
    const { country } = jobsConfig.regionMapping[regionCode as keyof typeof jobsConfig.regionMapping];
    
    // Call edge function that proxies Adzuna API
    const response = await fetch('/api/fetch-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region: regionCode, country }),
    });
    
    if (!response.ok) {
      console.warn('Adzuna API failed, falling back to mock data');
      return fetchMockJobs(regionCode);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Adzuna fetch error:', error);
    return fetchMockJobs(regionCode);
  }
};

// Main jobs service
export const jobsService = {
  async fetchJobs(regionCode: string): Promise<JobData[]> {
    // Check cache first
    const cached = getCachedJobs(regionCode);
    if (cached) {
      console.log(`Using cached jobs for ${regionCode}`);
      return cached;
    }
    
    // Fetch based on configured source
    let jobs: JobData[] = [];
    
    try {
      switch (jobsConfig.source) {
        case 'adzuna':
          jobs = await fetchAdzunaJobs(regionCode);
          break;
        case 'supabase':
          // TODO: Implement Supabase fetching
          jobs = await fetchMockJobs(regionCode);
          break;
        case 'mock':
        default:
          jobs = await fetchMockJobs(regionCode);
          break;
      }
      
      // Cache the results
      setCachedJobs(regionCode, jobs);
      
      return jobs;
    } catch (error) {
      console.error('Jobs fetch error:', error);
      
      // Try to return stale cache if available
      const staleCache = localStorage.getItem(`${CACHE_KEYS.JOBS_PREFIX}${regionCode}`);
      if (staleCache) {
        console.log('Returning stale cache due to fetch error');
        return JSON.parse(staleCache);
      }
      
      throw error;
    }
  },
  
  clearCache(region?: string): void {
    if (region) {
      localStorage.removeItem(`${CACHE_KEYS.JOBS_PREFIX}${region}`);
      localStorage.removeItem(`${CACHE_KEYS.LAST_FETCH}${region}`);
    } else {
      // Clear all job caches
      const regions = Object.keys(jobsConfig.regionMapping);
      regions.forEach(r => {
        localStorage.removeItem(`${CACHE_KEYS.JOBS_PREFIX}${r}`);
        localStorage.removeItem(`${CACHE_KEYS.LAST_FETCH}${r}`);
      });
    }
  },
};
