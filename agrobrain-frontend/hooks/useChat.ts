import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatSession, ChatMessage } from '@/types';
import { apiGet, apiPost } from '@/lib/api';

interface UseChatReturn {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => Promise<ChatSession>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export function useChat(sessionId: string | null): UseChatReturn {
  const queryClient = useQueryClient();

  // Fetch all chat sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async (): Promise<ChatSession[]> => {
      const response = await apiGet<ChatSession[]>('/chat/sessions');
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch current session messages
  const { data: currentSession } = useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: async (): Promise<ChatSession | null> => {
      if (!sessionId) return null;
      const response = await apiGet<ChatSession>(`/chat/sessions/${sessionId}`);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    },
    enabled: !!sessionId,
    staleTime: 1000, // 1 second for real-time updates
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await apiPost<any>('/chat/message', {
        message: content,
        sessionId: sessionId,
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to send message');
    },
    onMutate: async ({ sessionId, content }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chat-session', sessionId] });

      // Snapshot the previous value
      const previousSession = queryClient.getQueryData(['chat-session', sessionId]);

      // Optimistically update to the new value
      const newUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        msgId: `temp-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        language: 'en' // TODO: Get from user preference
      };

      queryClient.setQueryData(['chat-session', sessionId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, newUserMessage]
        };
      });

      return { previousSession };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSession) {
        queryClient.setQueryData(['chat-session', variables.sessionId], context.previousSession);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['chat-session', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiPost<ChatSession>('/chat/sessions', {
        title: 'New Chat'
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to create session');
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      return newSession;
    }
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiDelete(`/chat/sessions/${sessionId}`);
      if (!response.success) {
        throw new Error('Failed to delete session');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    }
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId) {
      throw new Error('No active session');
    }

    await sendMessageMutation.mutateAsync({ sessionId, content });
  }, [sessionId, sendMessageMutation]);

  const createNewSession = useCallback(async () => {
    return await createSessionMutation.mutateAsync();
  }, [createSessionMutation]);

  const deleteSession = useCallback(async (sessionIdToDelete: string) => {
    await deleteSessionMutation.mutateAsync(sessionIdToDelete);
  }, [deleteSessionMutation]);

  return {
    sessions,
    currentSession: currentSession || null,
    messages: currentSession?.messages || [],
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    createNewSession,
    deleteSession
  };
}
