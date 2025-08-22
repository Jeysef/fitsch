import { useContext, type Accessor } from "solid-js";
import { PostHog, PostHogContext } from "../context";

export const usePostHog = (): Accessor<PostHog> => {
  const context = useContext(PostHogContext);
  return context.client;
};
