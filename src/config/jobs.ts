// Jobs API Configuration
export const jobsConfig = {
  // API source: 'mock' | 'adzuna' | 'supabase'
  source: 'mock' as 'mock' | 'adzuna' | 'supabase',
  
  // Cache settings
  cacheEnabled: true,
  cacheDuration: 1000 * 60 * 30, // 30 minutes
  
  // API endpoints and keys
  apis: {
    adzuna: {
      baseUrl: 'https://api.adzuna.com/v1/api/jobs',
      // Public Adzuna demo credentials (limited rate)
      appId: '1',
      appKey: 'test',
    },
  },
  
  // Region mapping to country codes
  regionMapping: {
    kuwait: { country: 'kw', locationId: 'Kuwait' },
    uae: { country: 'ae', locationId: 'Dubai' },
    saudi: { country: 'sa', locationId: 'Riyadh' },
    qatar: { country: 'qa', locationId: 'Doha' },
    india: { country: 'in', locationId: 'Bangalore' },
  },
  
  // Default job query params
  defaultParams: {
    resultsPerPage: 20,
    sortBy: 'date',
  },
};

// Job data structure interface
export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  link: string;
  description: string;
  posted?: string;
}

export const CACHE_KEYS = {
  JOBS_PREFIX: 'brandmyprofile_jobs_',
  LAST_FETCH: 'brandmyprofile_jobs_last_fetch_',
};
