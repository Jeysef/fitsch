import { Component } from 'solid-js';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

interface NetworkError {
  code: string;
  syscall: string;
  hostname: string;
}

interface ErrorBoundaryFallbackProps {
  error: any;
  reset: () => void;
}

const getErrorMessage = (error: any): string => {
  // Network errors
  if (error.code === 'ENOTFOUND') {
    return `Unable to connect to ${error.hostname}. Please check your internet connection or try again later.`;
  }
  if (error.code === 'ECONNREFUSED') {
    return 'Connection refused. The server might be down or unavailable.';
  }
  if (error.code === 'ETIMEDOUT') {
    return 'Connection timed out. Please try again later.';
  }

  // API errors (assuming standard HTTP status codes)
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.status === 403) {
    return 'You do not have permission to access this resource.';
  }
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Default error message
  return error.message || 'An unexpected error occurred.';
};

const ErrorFallback: Component<ErrorBoundaryFallbackProps> = (props) => {
  const errorMessage = getErrorMessage(props.error);
  const isNetworkError = props.error.code === 'ENOTFOUND' ||
    props.error.code === 'ECONNREFUSED' ||
    props.error.code === 'ETIMEDOUT';

  return (
    <Alert variant="destructive" class="w-full">
      <AlertTitle class="text-lg font-semibold mb-2">
        {isNetworkError ? 'Connection Error' : 'Error'}
      </AlertTitle>
      <AlertDescription class="space-y-4">
        <p class="text-sm">{errorMessage}</p>

        {/* Debug information (only show in development) */}
        {import.meta.env.DEV && (
          <details class="mt-2">
            <summary class="text-xs cursor-pointer">Technical Details</summary>
            <pre class="text-xs mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
              {JSON.stringify(props.error, null, 2)}
            </pre>
          </details>
        )}

        <button
          class="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => props.reset()}
        >
          Try Again
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorFallback;