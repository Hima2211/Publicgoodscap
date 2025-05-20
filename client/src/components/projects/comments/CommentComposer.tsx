import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CommentComposerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  parentComment?: Comment;  // If replying to a specific comment
  onSuccess?: () => void;
}

export function CommentComposer({
  isOpen,
  onClose,
  projectId,
  parentComment,
  onSuccess
}: CommentComposerProps) {
  const [content, setContent] = useState('');
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          userId: address,
          parentId: parentComment?.id || 0,
          threadId: parentComment?.threadId || 0,
          depth: parentComment ? parentComment.depth + 1 : 0
        })
      });
      
      if (!response.ok) throw new Error('Failed to post comment');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh comments
      queryClient.invalidateQueries({ 
        queryKey: ['comments', projectId]
      });
      
      // Show success toast
      toast({
        description: parentComment 
          ? "Reply posted successfully!" 
          : "Comment posted successfully!",
        duration: 2000,
      });

      // Clear form and close modal
      setContent('');
      onClose();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message,
        duration: 3000,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({
        variant: "destructive",
        description: "Please connect your wallet to comment",
        duration: 3000,
      });
      return;
    }
    if (!content.trim()) return;
    await createCommentMutation.mutateAsync();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-darkCard border-darkBorder sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>
            {parentComment ? 'Reply to Comment' : 'Add Comment'}
          </DialogTitle>
        </DialogHeader>

        {/* Parent comment for context when replying */}
        {parentComment && (
          <div className="p-4 rounded-lg bg-darkBg border border-darkBorder mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parentComment.userId}`} 
                  alt="Avatar" 
                />
                <AvatarFallback className="bg-primary/10">
                  {parentComment.userId.toString().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white line-clamp-2">
                  {parentComment.content}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} 
                alt="Your avatar" 
              />
              <AvatarFallback className="bg-primary/10">
                {address?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentComment 
                  ? "Write a reply..." 
                  : "What are your thoughts?"
                }
                className="bg-darkBg border-darkBorder min-h-[100px] text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
