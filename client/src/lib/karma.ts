// Fetch projects from Karma using the official indexer API
// See: https://github.com/show-karma/karma-gap-sdk?tab=readme-ov-file#4-fetching-entities

export interface KarmaProject {
  uid: string;
  title: string;
  description?: string;
  imageURL?: string;
  links?: Array<{ type: string; url: string }>;
  tags?: Array<{ name: string }>;
  [key: string]: any;
}

export async function fetchKarmaProjects(): Promise<KarmaProject[]> {
  try {
    const response = await fetch('https://gapapi.karmahq.xyz/projects');
    if (!response.ok) throw new Error(`Failed to fetch Karma projects: ${response.status}`);
    const data = await response.json();
    console.log('Karma API response:', data); // Debug log
    
    if (!Array.isArray(data)) {
      console.error('Karma API returned unexpected data format:', data);
      return [];
    }
    
    // Transform Karma data to match our Project interface
    return data.filter(project => project && project.uid).map((project: any) => ({
      id: project.uid || `karma-${Date.now()}`,
      name: project.external?.github?.[0]?.split('/').pop() || 'Untitled Project',
      description: project.data?.description || '',
      logo: project.data?.imageURL || '/placeholder-logo.png',
      category: (project.data?.category || 'public_goods').toLowerCase(),
      totalFunding: project.grants?.[0]?.amount || 0,
      fundingSources: ['Karma'],
      website: project.links?.find((l: any) => l.type === 'website')?.url || '',
      github: project.links?.find((l: any) => l.type === 'github')?.url || '',
      twitter: project.links?.find((l: any) => l.type === 'twitter')?.url || '',
      discord: project.links?.find((l: any) => l.type === 'discord')?.url || '',
      telegram: project.links?.find((l: any) => l.type === 'telegram')?.url || '',
      inFundingRound: true,
      fundingProgress: 0,
      isHot: false,
      isTrending: false
    }));
  } catch (error) {
    console.error('Error fetching Karma projects:', error);
    return [];
  }
}
