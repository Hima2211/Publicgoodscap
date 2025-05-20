export interface Comment {
  id: number;
  content: string;
  projectId: number;
  userId: number;
  createdAt: string;
  parentId: number;
  threadId: number;
  depth: number;
  replyCount: number;
  upvotes: number;
  mentions: string[] | null;
  updatedAt: string;
  user?: {
    address: string;
    avatar: string;
  };
  hasLiked?: boolean;
}

export interface CommentResponse extends Comment {
  user: {
    address: string;
    avatar: string;
  };
  hasLiked: boolean;
}
