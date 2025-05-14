import { Project } from '@shared/schema';

// Project with derived fields (convenience interface)
export interface ProjectWithMeta extends Project {
  statusText: string;
  statusColor: string;
  progressColorClasses: string;
  categoryDisplayName: string;
  categoryClass: string;
}
