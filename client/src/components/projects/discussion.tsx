import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaReply } from 'react-icons/fa';
import { BiUpvote } from 'react-icons/bi';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Comment {
  id: number;
  content: string;
  user: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  points: number;
  replies: Comment[];
}

interface DiscussionProps {
  projectId: number;
}

export default function Discussion({ projectId }: DiscussionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for now - will be replaced with real data from API
  const comments: Comment[] = [
    {
      id: 1,
      content: 'This project has so much potential! The team behind it has a great track record.',
      user: {
        name: 'Alice',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
      },
      createdAt: new Date('2024-01-20T10:00:00'),
      points: 12,
      replies: [
        {
          id: 3,
          content: 'Agreed! Their previous work on similar projects was impressive.',
          user: {
            name: 'Bob',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
          },
          createdAt: new Date('2024-01-20T11:30:00'),
          points: 5,
          replies: []
        }
      ]
    },
    {
      id: 2,
      content: 'I have a question about the tokenomics. How will the token distribution work?',
      user: {
        name: 'Carol',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
      },
      createdAt: new Date('2024-01-19T15:45:00'),
      points: 8,
      replies: []
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to submit comment/reply
    setNewComment('');
    setReplyTo(null);
  };

  const handleUpvote = (commentId: number) => {
    // Add API call to upvote comment
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${!isReply ? 'mb-6' : 'mt-4'}`}>
      <img
        src={comment.user.avatar}
        alt={comment.user.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        <div className="p-3 rounded-lg bg-darkCard border border-darkBorder">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-white">{comment.user.name}</span>
              <span className="mx-1.5 text-darkText">•</span>
              <span className="text-xs text-darkText">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-darkText hover:text-white"
              onClick={() => handleUpvote(comment.id)}
            >
              <BiUpvote className="h-4 w-4 mr-1" />
              <span className="text-xs">{comment.points}</span>
            </Button>
          </div>
          <p className="text-sm text-darkText">{comment.content}</p>
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-darkText hover:text-white"
              onClick={() => setReplyTo(comment.id)}
            >
              <FaReply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>
        {replyTo === comment.id && (
          <div className="mt-3">
            <form onSubmit={handleSubmit}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply..."
                className="bg-darkBg border-darkBorder mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim()}
                >
                  Reply
                </Button>
              </div>
            </form>
          </div>
        )}
        {comment.replies.length > 0 && (
          <div className="pl-4 border-l border-darkBorder mt-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Start a discussion..."
          className="bg-darkBg border-darkBorder mb-2"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
}
