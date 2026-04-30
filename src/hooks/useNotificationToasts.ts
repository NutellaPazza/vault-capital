import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';
import type { Notification } from '@/types';

const KNOWN_STATIC_ROUTES = new Set([
  '/dashboard',
  '/explore',
  '/portfolio',
  '/wallet',
  '/marketplace',
  '/profile',
  '/admin',
  '/about',
  '/how-it-works',
  '/faq',
  '/terms',
]);

const labelForLink = (link?: string) => {
  if (!link) return null;
  if (link.startsWith('/pool/')) return 'Open vault';
  if (link.startsWith('/marketplace')) return 'Open Resale board';
  if (link.startsWith('/portfolio')) return 'Open portfolio';
  if (link.startsWith('/wallet')) return 'Open wallet';
  return 'Open';
};

type LinkError = {
  scope: 'marketplace-listing' | 'marketplace-pool' | 'vault' | 'unknown';
  title: string;
  description: string;
};

/**
 * Validate that a notification link can actually be opened in the current
 * session. Returns null if the route is reachable, or a structured error
 * (title + description + scope) when it is not, so the toast layer can
 * surface a context-specific message.
 */
const validateLink = (link: string): LinkError | null => {
  try {
    const [pathRaw, queryRaw = ''] = link.split('?');
    const path = pathRaw.split('#')[0];
    const query = new URLSearchParams(queryRaw.split('#')[0]);
    const { pools, listings } = useAppStore.getState();

    if (path.startsWith('/pool/')) {
      const poolId = path.slice('/pool/'.length);
      const pool = poolId ? pools.find(p => p.id === poolId) : undefined;
      if (!pool) {
        return {
          scope: 'vault',
          title: 'Vault unavailable',
          description: 'This vault is no longer available.',
        };
      }
      return null;
    }

    if (path === '/marketplace') {
      const listingId = query.get('listing');
      if (listingId) {
        const listing = listings.find(l => l.id === listingId);
        if (!listing) {
          return {
            scope: 'marketplace-listing',
            title: 'Listing not found',
            description: 'This listing no longer exists on the Resale board.',
          };
        }
        if (listing.status !== 'active') {
          return {
            scope: 'marketplace-listing',
            title: listing.status === 'sold' ? 'Listing already sold' : 'Listing no longer active',
            description:
              listing.status === 'sold'
                ? 'Another investor has already purchased this position.'
                : 'The seller withdrew or closed this listing.',
          };
        }
      }
      const poolId = query.get('pool');
      if (poolId && !pools.find(p => p.id === poolId)) {
        return {
          scope: 'marketplace-pool',
          title: 'Vault unavailable on Resale board',
          description: 'This vault is no longer listed on the Resale board.',
        };
      }
      return null;
    }

    if (KNOWN_STATIC_ROUTES.has(path)) return null;

    return {
      scope: 'unknown',
      title: 'Page unavailable',
      description: 'This page is not available right now.',
    };
  } catch {
    return {
      scope: 'unknown',
      title: 'Page unavailable',
      description: 'This page is not available right now.',
    };
  }
};

/**
 * Subscribes to notifications and emits a toast whenever a new notification
 * lands for the current user.
 *
 * Dedup strategy (defense in depth):
 *   1. `toastedNotificationIds` (persisted in localStorage) tracks every
 *      notification we have already shown — survives reloads and route
 *      changes.
 *   2. We also skip notifications already marked as `read` so that anything
 *      acknowledged via the Notification Center never re-toasts.
 *
 * Any interaction with the toast (clicking the action button or dismissing
 * it) marks the underlying notification as read.
 *
 * Toast action navigation guards the destination: it shows a loading toast,
 * validates that the route is reachable in the current session, and surfaces
 * an error toast if navigation fails or the link is stale.
 */
export const useNotificationToasts = () => {
  const navigate = useNavigate();
  const navRef = useRef(navigate);
  navRef.current = navigate;

  useEffect(() => {
    const fire = (notifications: Notification[]) => {
      const { currentUser, toastedNotificationIds, markNotificationsToasted, markNotificationRead } =
        useAppStore.getState();
      if (!currentUser) return;

      const seen = new Set(toastedNotificationIds);
      const fresh = notifications.filter(
        n => n.user_id === currentUser.id && !seen.has(n.id) && !n.read,
      );
      if (!fresh.length) return;

      // Reserve the IDs immediately so a re-render mid-loop cannot double-fire.
      markNotificationsToasted(fresh.map(n => n.id));

      fresh.forEach(n => {
        const isFailure = /fail/i.test(n.title);
        const actionLabel = labelForLink(n.link);
        const toastId = `notif-${n.id}`;

        toast(n.title, {
          id: toastId,
          description: n.message,
          className: isFailure ? 'border-destructive/40' : undefined,
          // Any dismiss (timeout, swipe, X button) marks the notification as read.
          onDismiss: () => markNotificationRead(n.id),
          onAutoClose: () => markNotificationRead(n.id),
          action: actionLabel && n.link
            ? {
                label: actionLabel,
                onClick: () => {
                  const link = n.link!;
                  const loadingId = `notif-nav-${n.id}`;

                  // Show a transient loading toast while we validate + navigate.
                  toast.loading('Opening…', { id: loadingId });

                  // Defer to the next tick so the loading state is visible
                  // even when validation is synchronous.
                  setTimeout(() => {
                    const error = validateLink(link);
                    if (error) {
                      toast.error(error.title, {
                        id: loadingId,
                        description: error.description,
                      });
                      // Still mark as read — the user acknowledged the alert.
                      markNotificationRead(n.id);
                      toast.dismiss(toastId);
                      return;
                    }

                    try {
                      navRef.current(link);
                      markNotificationRead(n.id);
                      toast.success('Opened', {
                        id: loadingId,
                        description: actionLabel ?? 'Page opened.',
                        duration: 1500,
                      });
                      toast.dismiss(toastId);
                    } catch (err) {
                      console.error('Notification navigation failed', err);
                      toast.error('Could not open page', {
                        id: loadingId,
                        description: 'Something went wrong. Please try again.',
                      });
                    }
                  }, 0);
                },
              }
            : undefined,
        });
      });
    };

    // Run once on mount for any notifications created while this user was offline.
    fire(useAppStore.getState().notifications);

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.notifications === prev.notifications) return;
      fire(state.notifications);
    });
    return () => unsub();
  }, []);
};
