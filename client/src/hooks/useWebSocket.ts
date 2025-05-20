import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface UseWebSocketProps {
  projectId?: number;
  onCommentAdded?: (comment: any) => void;
  onCommentUpdated?: (comment: any) => void;
  onCommentDeleted?: (commentId: number) => void;
}

export const useWebSocket = ({
  projectId,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: UseWebSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get the current port from window.location
    const port = window.location.port;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;

    // Create socket connection
    socketRef.current = io(`${protocol}//${host}:${port}`);

    // If we have a project ID, join that project's room
    if (projectId) {
      socketRef.current.emit('join-project', projectId);
    }

    // Set up event listeners
    if (onCommentAdded) {
      socketRef.current.on('comment-added', onCommentAdded);
    }

    if (onCommentUpdated) {
      socketRef.current.on('comment-updated', onCommentUpdated);
    }

    if (onCommentDeleted) {
      socketRef.current.on('comment-deleted', onCommentDeleted);
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        if (projectId) {
          socketRef.current.emit('leave-project', projectId);
        }
        socketRef.current.disconnect();
      }
    };
  }, [projectId, onCommentAdded, onCommentUpdated, onCommentDeleted]);

  return socketRef.current;
};
