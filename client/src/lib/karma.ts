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
    if (!response.ok) throw new Error('Failed to fetch Karma projects');
    const data = await response.json();
    // The API returns an array of projects in data
    return data;
  } catch (error) {
    console.error('Error fetching Karma projects:', error);
    return [];
  }
}
