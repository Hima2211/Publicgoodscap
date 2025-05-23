
// Fetch projects from Giveth using their GraphQL API
// See: https://mainnet.serve.giveth.io/graphql

interface GivethProject {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  totalDonations: number;
  categories: { name: string }[];
  addresses: { address: string, network: string }[];
  adminUser: { name: string; walletAddress: string };
}

export async function fetchGivethProjects(): Promise<any[]> {
  try {
    const response = await fetch('https://mainnet.serve.giveth.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetProjects {
            projects(
              orderBy: { field: "totalDonations", direction: DESC }
              limit: 100
            ) {
              id
              title
              description
              image
              slug
              totalDonations
              categories { name }
              addresses { address network }
              adminUser { name walletAddress }
            }
          }
        `
      })
    });

    if (!response.ok) throw new Error(`Failed to fetch Giveth projects: ${response.status}`);
    const { data } = await response.json();
    console.log('Giveth API response:', data);

    // Transform Giveth data to match our Project interface
    return data.projects.map((project: GivethProject) => ({
      id: project.id,
      name: project.title,
      description: project.description,
      logo: project.image || '/placeholder-logo.png',
      category: project.categories?.[0]?.name?.toLowerCase() || 'public_goods',
      totalFunding: Number(project.totalDonations || 0),
      fundingSources: ['Giveth'],
      website: `https://giveth.io/project/${project.slug}`,
      github: '',
      twitter: '',
      discord: '',
      telegram: '',
      inFundingRound: true,
      fundingProgress: 0,
      isHot: false,
      isTrending: false
    }));
  } catch (error) {
    console.error('Error fetching Giveth projects:', error);
    return [];
  }
}
