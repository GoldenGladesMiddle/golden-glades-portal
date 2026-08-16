'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

export default function ApplicationDashboard() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    try {
      // Call your backend API endpoint to clear cookies/session
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear client storage and redirect
      localStorage.clear();
      router.push('/applications');
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Events to track active engagement
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Start timer on mount
    resetTimer();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Applications Dashboard</h1>
      <p>Session active. Inactivity timeout set for 20 minutes.</p>
    </div>
  );
}
