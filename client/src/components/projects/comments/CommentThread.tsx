import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment, CommentResponse } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaReply } from 'react-icons/fa';
import { CommentComposer } from './CommentComposer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CommentThreadProps {
  projectId: number;
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

export function CommentThread({ 
  projectId, 
  comment, 
  depth = 0,
  maxDepth = 3  // Maximum nesting level
}: CommentThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch replies when thread is expanded
  const { data: replies = [] } = useQuery<Comment[]>({
    queryKey: ['comments', projectId, comment.id, 'replies'],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/comments/${comment.id}/replies`);
      if (!response.ok) throw new Error('Failed to fetch replies');
      return response.json();
    },
    enabled: isExpanded && comment.replyCount > 0
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: address })
      });
      if (!response.ok) throw new Error('Failed to like comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['comments', projectId] 
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message,
        duration: 3000,
      });
    }
  });

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) {
      toast({
        variant: "destructive",
        description: "Please connect your wallet to like comments",
        duration: 3000,
      });
      return;
    }
    await likeMutation.mutateAsync();
  };

  const handleReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) {
      toast({
        variant: "destructive",
        description: "Please connect your wallet to reply",
        duration: 3000,
      });
      return;
    }
    setShowReplyComposer(true);
  };

  return (
    <div className="group" style={{ marginLeft: depth ? '1rem' : 0 }}>
      <div className="flex gap-3 mb-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`}
            alt="Avatar" 
          />
          <AvatarFallback className="bg-primary/10">
            {comment.userId.toString().substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-sm text-white">
                {comment.userId.toString().slice(0, 6)}...{comment.userId.toString().slice(-4)}
              </span>
              <span className="mx-1.5 text-darkText">•</span>
              <span className="text-xs text-darkText">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${comment.hasLiked ? 'text-red-500' : 'text-darkText'}`}
                onClick={handleLike}
              >
                <FaHeart className="h-3 w-3" />
                <span className="text-xs">{comment.upvotes}</span>
              </Button>
              
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-darkText hover:text-white"
                  onClick={handleReply}
                >
                  <FaReply className="h-3 w-3" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-white mt-1 break-words">
            {comment.content}
          </p>

          {comment.replyCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="mt-2 text-primary p-0 h-auto"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded 
                ? "Hide replies" 
                : `Show ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
              }
            </Button>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {isExpanded && replies.map((reply) => (
        <CommentThread
          key={reply.id}
          projectId={projectId}
          comment={reply}
          depth={depth + 1}
          maxDepth={maxDepth}
        />
      ))}

      {/* Reply composer modal */}
      <CommentComposer
        isOpen={showReplyComposer}
        onClose={() => setShowReplyComposer(false)}
        projectId={projectId}
        parentComment={comment}
        onSuccess={() => setIsExpanded(true)}
      />
    </div>
  );
}
