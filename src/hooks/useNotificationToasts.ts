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
 * lands for the current user. Dedup is persisted across reloads via the
 * `toastedNotificationIds` slice in the Zustand store.
 *
 * Clicking the toast action navigates to the notification's `link` and marks
 * it as read.
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
      const fresh = notifications.filter(n => n.user_id === currentUser.id && !seen.has(n.id));
      if (!fresh.length) return;

      fresh.forEach(n => {
        const isFailure = /fail/i.test(n.title);
        const actionLabel = labelForLink(n.link);
        toast(n.title, {
          description: n.message,
          className: isFailure ? 'border-destructive/40' : undefined,
          action: actionLabel && n.link
            ? {
                label: actionLabel,
                onClick: () => {
                  markNotificationRead(n.id);
                  navRef.current(n.link!);
                },
              }
            : undefined,
        });
      });

      markNotificationsToasted(fresh.map(n => n.id));
    };

    // Run once on mount for any notifications created while this user was offline
    fire(useAppStore.getState().notifications);

    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.notifications === prev.notifications) return;
      fire(state.notifications);
    });
    return () => unsub();
  }, []);
};
