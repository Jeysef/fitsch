import type { CaptureError } from "nitropack/types";
import type { Storage } from "vinxi/storage";

export interface CachePluginData {
  storage: Storage;
  captureError: CaptureError;
}
