import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';
import type { Notification } from '@/types';

const labelForLink = (link?: string) => {
  if (!link) return null;
  if (link.startsWith('/pool/')) return 'Open vault';
  if (link.startsWith('/marketplace')) return 'Open Resale board';
  if (link.startsWith('/portfolio')) return 'Open portfolio';
  if (link.startsWith('/wallet')) return 'Open wallet';
  return 'Open';
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
                  markNotificationRead(n.id);
                  navRef.current(n.link!);
                  toast.dismiss(toastId);
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
