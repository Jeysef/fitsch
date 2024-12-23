import { cookieStorage } from "@solid-primitives/storage";
import { type Component, Show, createSignal } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ui/loader";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";

interface NetworkError {
  errno: number;
  code: string;
  syscall: string;
  hostname: string;
}

interface ErrorBoundaryFallbackProps {
  error: NetworkError | any;
  reset: () => Promise<void>;
}

const getErrorMessage = (error: any): string => {
  // Network errors
  if (error.code === "ENOTFOUND") {
    return `Unable to connect to ${error.hostname}. Please check your internet connection or try again later.`;
  }
  if (error.code === "ECONNREFUSED") {
    return "Connection refused. The server might be down or unavailable.";
  }
  if (error.code === "ETIMEDOUT") {
    return "Connection timed out. Please try again later.";
  }

  // API errors (assuming standard HTTP status codes)
  if (error.status === 404) {
    return "The requested resource was not found.";
  }
  if (error.status === 403) {
    return "You do not have permission to access this resource.";
  }
  if (error.status >= 500) {
    return "Server error. Please try again later.";
  }

  // Default error message
  return error.message || "An unexpected error occurred.";
};

const ErrorFallback: Component<ErrorBoundaryFallbackProps> = (props) => {
  const { t } = useI18n();
  const errorMessage = getErrorMessage(props.error);
  const isNetworkError =
    props.error.code === "ENOTFOUND" || props.error.code === "ECONNREFUSED" || props.error.code === "ETIMEDOUT";

  const [loading, setLoading] = createSignal(false);
  return (
    <Alert variant="destructive" class="w-full">
      <AlertTitle class="text-lg font-semibold mb-2">{isNetworkError ? "Connection Error" : "Error"}</AlertTitle>
      <AlertDescription class="space-y-4">
        <p class="text-sm">{errorMessage}</p>

        {/* Debug information (only show in development) */}
        {import.meta.env.DEV && (
          <details class="mt-2">
            <summary class="text-xs cursor-pointer">Technical Details</summary>
            <pre class="text-xs mt-2 p-2 bg-gray-100 rounded overflow-x-auto">{JSON.stringify(props.error, null, 2)}</pre>
            <Button
              variant="destructive"
              onClick={() => {
                throw props.error;
              }}
              size="sm"
              class="mt-2"
            >
              Throw Error
            </Button>
          </details>
        )}
        <Button
          variant="outline"
          class="mt-2 h-auto"
          onClick={() => {
            localStorage.clear();
            cookieStorage.clear();
            window.location.reload();
          }}
        >
          {t("error.purgeAndReload")}
        </Button>
        <Button
          variant="destructive"
          disabled={loading()}
          onClick={async () => {
            setLoading(true);
            await props.reset();
            setLoading(false);
          }}
        >
          <Show
            when={!loading()}
            fallback={
              <Loader
                class={cn("w-full", "before:content-[var(--tryAgainContent)] before:opacity-0 before:invisible before:h-0")}
                style={{ "--tryAgainContent": `"${t("error.tryAgain")}"` }}
              />
            }
          >
            {t("error.tryAgain")}
          </Show>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorFallback;
