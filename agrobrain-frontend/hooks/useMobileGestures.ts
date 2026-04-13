'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPullToRefresh?: () => void;
}

interface PullToRefreshOptions {
  threshold?: number;
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
}

export const useMobileGestures = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  options: { threshold?: number; preventDefault?: boolean } = {}
) => {
  const { threshold = 50, preventDefault = true } = options;
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      touchEndY.current = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Only detect horizontal swipes
      if (absDeltaX > absDeltaY && absDeltaX > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
      // Only detect vertical swipes
      else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, threshold, preventDefault, elementRef]);
};

export const usePullToRefresh = (
  options: PullToRefreshOptions
) => {
  const { threshold = 100, onRefresh, disabled = false } = options;
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    let isPullingStarted = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull-to-refresh when at the top of the page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        isPullingStarted = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingStarted) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0 && distance < threshold * 2) {
        e.preventDefault();
        setPullDistance(distance);
        setIsPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPullingStarted) return;

      isPullingStarted = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold, onRefresh, disabled, pullDistance, isRefreshing]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const rotation = pullProgress * 360;

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    rotation,
    RefreshIndicator: () => React.createElement(
      'div',
      {
        className: 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none',
        style: {
          opacity: isPulling ? pullProgress : 0,
          transform: `translateX(-50%) rotate(${rotation}deg)`,
        },
      },
      React.createElement(
        'div',
        {
          className: 'w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg',
        },
        React.createElement(
          'svg',
          {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          React.createElement(
            'path',
            {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
            }
          )
        )
      )
    ),
  };
};

export const useSidebarSwipe = (onOpen: () => void, onClose: () => void) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      // Swipe right from left edge to open sidebar
      if (deltaX > 50 && touchStartX.current < 20) {
        onOpen();
        setIsSidebarOpen(true);
      }
      // Swipe left to close sidebar
      else if (deltaX < -50 && isSidebarOpen) {
        onClose();
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onOpen, onClose, isSidebarOpen]);

  return { isSidebarOpen };
};

// Haptic feedback utility
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },
};

// Touch target size utility
export const ensureTouchTarget = (element: HTMLElement, minSize: number = 44) => {
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  if (width < minSize || height < minSize) {
    const scale = Math.max(minSize / width, minSize / height);
    element.style.transform = `scale(${scale})`;
    element.style.transformOrigin = 'center';
  }
};

// Long press gesture
export const useLongPress = (
  onLongPress: () => void,
  options: { delay?: number; threshold?: number } = {}
) => {
  const { delay = 500, threshold = 10 } = options;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const touchStartPos = useRef<{ x: number; y: number }>();

  const start = (clientX: number, clientY: number) => {
    touchStartPos.current = { x: clientX, y: clientY };
    timeoutRef.current = setTimeout(() => {
      setIsLongPressing(true);
      hapticFeedback.medium();
      onLongPress();
    }, delay);
  };

  const cancel = (clientX?: number, clientY?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Check if moved beyond threshold
    if (touchStartPos.current && clientX !== undefined && clientY !== undefined) {
      const deltaX = Math.abs(clientX - touchStartPos.current.x);
      const deltaY = Math.abs(clientY - touchStartPos.current.y);
      if (deltaX > threshold || deltaY > threshold) {
        setIsLongPressing(false);
      }
    } else {
      setIsLongPressing(false);
    }
  };

  return {
    isLongPressing,
    props: {
      onTouchStart: (e: React.TouchEvent) => {
        start(e.touches[0].clientX, e.touches[0].clientY);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        cancel(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      },
      onTouchMove: (e: React.TouchEvent) => {
        cancel(e.touches[0].clientX, e.touches[0].clientY);
      },
      onMouseDown: (e: React.MouseEvent) => {
        start(e.clientX, e.clientY);
      },
      onMouseUp: (e: React.MouseEvent) => {
        cancel(e.clientX, e.clientY);
      },
      onMouseLeave: () => {
        cancel();
      },
    },
  };
};
