export type FunctionReturnError = { error: true; errorMessage: string };
export type FunctionReturn<T> = T | FunctionReturnError;

const withErrorHandeler = async <T>(promise: Promise<T>): Promise<FunctionReturn<T>> => {
  try {
    return await Promise.race([
      promise,
      new Promise<FunctionReturn<T>>((_, reject) =>
        // netlify allows 10 seconds for a function to run
        setTimeout(() => reject(new Error("Request timeout after 9 seconds")), 9800)
      ),
    ]);
  } catch (error: any) {
    console.error("Error occurred:", error);
    return { error: true, errorMessage: error?.message } satisfies FunctionReturnError;
  }
};

export function isErrorReturn<T>(data: FunctionReturn<T>): data is FunctionReturnError {
  return typeof data === "object" && data !== null && "error" in data && data.error === true;
}

export default withErrorHandeler;
