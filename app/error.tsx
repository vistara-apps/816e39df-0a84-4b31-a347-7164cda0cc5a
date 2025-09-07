'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ActionLink } from '@/components/ActionLink';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-accent flex items-center justify-center p-4">
      <div className="glass-card p-8 text-center max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-display mb-4">Something went wrong!</h2>
        <p className="text-body text-white text-opacity-90 mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <ActionLink variant="primary" onClick={reset}>
            Try Again
          </ActionLink>
          <ActionLink 
            variant="secondary" 
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </ActionLink>
        </div>
      </div>
    </div>
  );
}
