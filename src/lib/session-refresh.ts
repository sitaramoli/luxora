'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Force refresh the current session to get updated user data from the database
 */
export function useSessionRefresh() {
  const { update } = useSession();
  const router = useRouter();

  const refreshSession = async () => {
    try {
      // Trigger a session update which will call the JWT callback with trigger: 'update'
      await update();
      
      // Refresh the current page to ensure all components get the updated session
      router.refresh();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

  return { refreshSession };
}

/**
 * Utility function to handle session refresh after profile updates
 */
export async function refreshSessionAfterUpdate(result: { sessionRefreshRequired?: boolean }) {
  if (typeof window !== 'undefined' && result.sessionRefreshRequired) {
    try {
      // Force a page refresh to update all components with new session data
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh session after update:', error);
    }
  }
}
