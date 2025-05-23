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
    // Determine WebSocket URL based on environment
    const wsUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin // Use the same origin in production
      : `${window.location.protocol}//${window.location.hostname}:5000`; // Default to port 5000 for development

    // Create socket connection
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

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
