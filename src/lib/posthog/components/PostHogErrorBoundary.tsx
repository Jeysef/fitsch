import { ErrorBoundary, JSX } from "solid-js";
import { usePostHog } from "../hooks";
import { isFunction } from "../utils/type-utils";

export type Properties = Record<string, any>;

export type PostHogErrorBoundaryFallbackProps = {
  error: unknown;
  exceptionEvent: unknown;
  componentStack: string;
};

export type PostHogErrorBoundaryProps = {
  children?: JSX.Element | (() => JSX.Element);
  fallback?: JSX.Element | ((props: PostHogErrorBoundaryFallbackProps) => JSX.Element);
  additionalProperties?: Properties | ((error: unknown) => Properties);
};

export const __POSTHOG_ERROR_MESSAGES = {
  INVALID_FALLBACK:
    "[PostHog.js][PostHogErrorBoundary] Invalid fallback prop, provide a valid React element or a function that returns a valid React element.",
};

export const PostHogErrorBoundary = (props: PostHogErrorBoundaryProps) => {
  const client = usePostHog();

  return (
    <ErrorBoundary
      fallback={(error) => {
        // Handle additional properties
        let currentProperties: Properties | undefined;
        if (isFunction(props.additionalProperties)) {
          currentProperties = props.additionalProperties(error);
        } else if (typeof props.additionalProperties === "object") {
          currentProperties = props.additionalProperties;
        }

        // Capture exception (synchronously, assuming PostHog's captureException returns the event)
        const exceptionEvent = client().captureException(error, currentProperties);

        // Approximate componentStack (SolidJS doesn't provide React-like fiber stack, so use error.stack)
        const componentStack = error instanceof Error ? (error.stack ?? "") : "";

        // Render fallback
        if (isFunction(props.fallback)) {
          // Call functional fallback with adapted props (note: we don't pass 'reset' as it's Solid-specific and not in original API)
          return props.fallback({ error, componentStack, exceptionEvent });
        } else if (props.fallback) {
          // Static fallback
          return props.fallback;
        } else {
          // Default fallback (original doesn't have one, but Solid requires something; use empty)
          console.warn(__POSTHOG_ERROR_MESSAGES.INVALID_FALLBACK);
          return <></>;
        }
      }}
    >
      {isFunction(props.children) ? props.children() : props.children}
    </ErrorBoundary>
  );
};
