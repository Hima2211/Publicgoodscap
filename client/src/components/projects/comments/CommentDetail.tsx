import { Comment } from '@shared/schema';
import { CommentThread } from './CommentThread';

interface CommentDetailProps {
  projectId: number;
  comment: Comment;
  onReply?: (comment: Comment) => void;
}

export function CommentDetail({ projectId, comment, onReply }: CommentDetailProps) {
  return (
    <div className="border-b border-darkBorder py-4">
      <CommentThread 
        projectId={projectId} 
        comment={comment}
      />
    </div>
  );
}
