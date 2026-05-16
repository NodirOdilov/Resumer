'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebSocketMessage, WebSocketResponse } from '@/types';

interface UseWebSocketOptions {
  resumeId: string | null;
  /** Base URL for the WebSocket server. Default: derived from NEXT_PUBLIC_WS_URL or window.location. */
  baseUrl?: string;
  /** Max reconnection attempts before giving up. Default: 5. */
  maxRetries?: number;
  /** Base reconnection delay in ms (exponential backoff). Default: 1000. */
  retryDelay?: number;
}

interface UseWebSocketReturn {
  sendUpdate: (message: WebSocketMessage) => void;
  previewHtml: string;
  isConnected: boolean;
}

export function useWebSocket({
  resumeId,
  baseUrl,
  maxRetries = 5,
  retryDelay = 1000,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const getWsUrl = useCallback((): string => {
    if (baseUrl) {
      return `${baseUrl}/ws/builder/${resumeId}/`;
    }
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_URL) {
      return `${process.env.NEXT_PUBLIC_WS_URL}/ws/builder/${resumeId}/`;
    }
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws/builder/${resumeId}/`;
    }
    return `ws://localhost:8000/ws/builder/${resumeId}/`;
  }, [resumeId, baseUrl]);

  const connect = useCallback(() => {
    if (!resumeId || typeof window === 'undefined') return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const url = getWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setIsConnected(true);
      retriesRef.current = 0;
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return;
      try {
        const response = JSON.parse(event.data as string) as WebSocketResponse;
        switch (response.type) {
          case 'preview_html':
            if (response.payload.html) {
              setPreviewHtml(response.payload.html);
            }
            break;
          case 'error':
            console.error('[WebSocket] Server error:', response.payload.error);
            break;
          case 'ack':
            // Acknowledged, no action needed
            break;
        }
      } catch {
        console.error('[WebSocket] Failed to parse message');
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setIsConnected(false);

      // Attempt reconnection with exponential backoff
      if (retriesRef.current < maxRetries) {
        const delay = retryDelay * Math.pow(2, retriesRef.current);
        retriesRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      // onclose will fire after onerror, which handles reconnection
    };
  }, [resumeId, getWsUrl, maxRetries, retryDelay]);

  // Connect when resumeId changes
  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendUpdate = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendUpdate, previewHtml, isConnected };
}
