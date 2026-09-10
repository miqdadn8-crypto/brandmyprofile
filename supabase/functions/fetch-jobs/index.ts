import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ADZUNA_APP_ID = Deno.env.get('ADZUNA_APP_ID') || '1';
const ADZUNA_APP_KEY = Deno.env.get('ADZUNA_APP_KEY') || 'test';

interface JobRequest {
  region: string;
  country: string;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { region, country }: JobRequest = await req.json();
    
    // Fetch jobs from Adzuna API
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=&content-type=application/json`;
    
    const response = await fetch(adzunaUrl);
    
    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Adzuna data to our format
    const jobs = data.results?.map((job: any, index: number) => ({
      id: `${region}-${job.id || index}`,
      title: job.title || 'Untitled Position',
      company: job.company?.display_name || 'Company Confidential',
      location: job.location?.display_name || 'Location not specified',
      salary: job.salary_min && job.salary_max 
        ? `${Math.round(job.salary_min)} - ${Math.round(job.salary_max)} ${job.salary_currency || 'USD'}`
        : job.salary_min 
        ? `From ${Math.round(job.salary_min)} ${job.salary_currency || 'USD'}`
        : 'Salary not specified',
      type: job.contract_type || 'Full-time',
      experience: 'Not specified',
      link: job.redirect_url || '#',
      description: job.description?.substring(0, 200) || 'No description available.',
    })) || [];

    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
