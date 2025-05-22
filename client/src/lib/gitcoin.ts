export interface GitcoinProject {
  id: string;
  title: string;
  description: string;
  website?: string;
  logoImageUrl?: string;
  tags?: string[];
  totalAmountDonatedInUsd?: string;
  uniqueDonorsCount?: number;
  roundId?: string;
  roundMetadata?: any;
  status?: string;
}

export async function fetchGitcoinProjects({
  roundId,
  categoryTag,
  first = 20,
}: {
  roundId?: string;
  categoryTag?: string;
  first?: number;
}): Promise<GitcoinProject[]> {
  // Build dynamic where filter as an object
  let variables: any = { first };
  let where: any = {};
  let useWhere = false;
  if (roundId) {
    where.round = roundId;
    useWhere = true;
  }
  if (categoryTag) {
    where.project_ = { tags_contains: [categoryTag] };
    useWhere = true;
  }
  if (useWhere) {
    variables.where = where;
  }

  // Build the argument list for the query in correct order
  const argListArr = [];
  if (useWhere) argListArr.push('where: $where');
  argListArr.push('first: $first');
  const argList = argListArr.join(', ');

  const query = `
    query GitcoinProjects($first: Int!${useWhere ? ', $where: Application_filter' : ''}) {
      applications(${argList}) {
        status
        totalAmountDonatedInUsd
        uniqueDonorsCount
        project {
          id
          metadata
        }
        round {
          id
          roundMetadata
        }
      }
    }
  `;

  try {
    const response = await fetch('/api/gitcoin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) throw new Error('Failed to fetch Gitcoin projects');
    const data = await response.json();
    console.log('Gitcoin API response:', data); // DEBUG LOG
    if (!data.data || !data.data.applications) return [];
    return data.data.applications.map((app: any) => {
      // Parse metadata from JSON string if needed
      const metadata = typeof app.project.metadata === 'string' 
        ? JSON.parse(app.project.metadata) 
        : (app.project.metadata || {});
      
      return {
        id: app.project.id,
        title: metadata.title || '',
        description: metadata.description || '',
        website: metadata.website,
        logoImageUrl: metadata.logoImg,
        tags: metadata.tags || [], // Get tags from metadata if available
        totalAmountDonatedInUsd: app.totalAmountDonatedInUsd,
        uniqueDonorsCount: app.uniqueDonorsCount,
        roundId: app.round?.id,
        roundMetadata: app.round?.roundMetadata,
        status: app.status,
      };
    });
  } catch (error) {
    console.error('Error fetching Gitcoin projects:', error);
    return [];
  }
}
