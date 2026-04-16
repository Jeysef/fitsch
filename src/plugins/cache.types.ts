import type { CaptureError } from "nitropack/types";
import type { Storage } from "unstorage";

export interface CachePluginData {
  storage: Storage;
  captureError: CaptureError;
}
