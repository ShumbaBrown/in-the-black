import * as Sentry from '@sentry/react-native';

/**
 * Returns a catch handler that logs sync errors to console and Sentry.
 *
 * Usage: somePromise.catch(captureSyncError('pushBook'))
 */
export function captureSyncError(operation: string) {
  return (error: unknown) => {
    console.warn(`Sync ${operation} failed:`, error);
    Sentry.captureException(error, {
      level: 'warning',
      tags: { syncOperation: operation },
    });
  };
}
