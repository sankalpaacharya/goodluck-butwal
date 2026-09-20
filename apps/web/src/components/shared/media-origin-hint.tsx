"use client";

import ReactDOM from "react-dom";
import { MEDIA_ORIGIN } from "@/lib/utils/media-url";

export function MediaOriginHint() {
  ReactDOM.preconnect(MEDIA_ORIGIN);
  ReactDOM.prefetchDNS(MEDIA_ORIGIN);
  return null;
}
