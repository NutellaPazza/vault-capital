import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';

/**
 * Subscribes to the notifications slice and fires a toast every time a new
 * notification is created for the current user. Also implicitly causes the UI
 * to re-render wallet/portfolio because Zustand state changed atomically.
 */
export const useNotificationToasts = () => {
  const seenIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    // Seed with currently existing notifications so we don't toast on mount
    const { notifications, currentUser } = useAppStore.getState();
    notifications.forEach(n => seenIds.current.add(n.id));
    initialized.current = true;

    const unsub = useAppStore.subscribe((state, prev) => {
      if (!initialized.current) return;
      const user = state.currentUser;
      if (!user) return;
      if (state.notifications === prev.notifications) return;

      const fresh = state.notifications.filter(
        n => n.user_id === user.id && !seenIds.current.has(n.id),
      );
      fresh.forEach(n => {
        seenIds.current.add(n.id);
        const isFailure = /fail/i.test(n.title);
        toast({
          title: n.title,
          description: n.message,
          variant: isFailure ? 'destructive' : 'default',
        });
      });
    });

    // Reference currentUser to silence lint and re-evaluate seed if user changes later
    void currentUser;
    return () => unsub();
  }, []);
};
