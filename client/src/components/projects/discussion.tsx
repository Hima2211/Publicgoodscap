import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaReply, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useAccount } from 'wagmi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  address: string;
  avatar: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  replies: Comment[];
  parentId?: number;
}

interface DiscussionProps {
  projectId: number;
}

export default function Discussion({ projectId }: DiscussionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Set up WebSocket connection with event handlers
  useWebSocket({
    projectId,
    onCommentAdded: (comment) => {
      queryClient.setQueryData(['comments', projectId], (oldData: Comment[] | undefined) => {
        if (!oldData) return [comment];
        return [...oldData, comment];
      });
    },
    onCommentUpdated: (updatedComment) => {
      queryClient.setQueryData(['comments', projectId], (oldData: Comment[] | undefined) => {
        if (!oldData) return [updatedComment];
        return oldData.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        );
      });
    },
    onCommentDeleted: (commentId) => {
      queryClient.setQueryData(['comments', projectId], (oldData: Comment[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(comment => comment.id !== commentId);
      });
    }
  });

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string, parentId?: number }) => {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId, userId: address })
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
      setNewComment('');
      setReplyingTo(null);
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: address })
      });
      if (!response.ok) throw new Error('Failed to like comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
    }
  });

  const handleSubmit = (parentId?: number) => {
    if (!address) return;
    if (!newComment.trim()) return;
    
    createCommentMutation.mutate({ content: newComment, parentId });
  };

  const handleLike = (commentId: number) => {
    if (!address) return;
    likeMutation.mutate(commentId);
  };

  const toggleComment = (commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies?.length > 0;

    return (
      <div key={comment.id} className={`flex gap-3 ${!isReply ? 'mb-6' : 'mt-4'}`}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.address}`}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div 
            className="p-4 rounded-lg bg-darkCard border border-darkBorder cursor-pointer hover:bg-darkCard/80 transition-colors"
            onClick={() => hasReplies && toggleComment(comment.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium text-white">
                  {comment.user.address.slice(0, 6)}...{comment.user.address.slice(-4)}
                </span>
                <span className="mx-1.5 text-darkText">•</span>
                <span className="text-xs text-darkText">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0 h-auto hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComment(comment.id);
                    }}
                  >
                    {isExpanded ? (
                      <FaChevronUp className="h-3 w-3 text-darkText" />
                    ) : (
                      <FaChevronDown className="h-3 w-3 text-darkText" />
                    )}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${comment.hasLiked ? 'text-red-500' : 'text-darkText'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(comment.id);
                }}
              >
                <FaHeart className="h-3 w-3" />
                <span className="text-xs">{comment.likes}</span>
              </Button>
            </div>
            <p className="text-sm text-white mb-3">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-darkText hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
              }}
            >
              <FaReply className="h-3 w-3 mr-1" />
              Reply {hasReplies && !isExpanded && `(${comment.replies.length})`}
            </Button>
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your reply..."
                    className="bg-darkBg border-darkBorder mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setNewComment('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSubmit(comment.id)}
                      disabled={!newComment.trim() || !address}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasReplies && isExpanded && (
            <div className="pl-4 border-l border-darkBorder mt-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {address ? (
        <div className="flex gap-3 mb-8">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="bg-darkBg border-darkBorder mb-2"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleSubmit()}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-darkText">
          Connect your wallet to join the discussion
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => !comment.parentId && renderComment(comment))}
      </div>
    </div>
  );
}
