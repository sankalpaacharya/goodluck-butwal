"use client";

import ReactDOM from "react-dom";
import { MEDIA_ORIGIN } from "@/lib/utils/media-url";

// The images come from another origin, so without this the DNS lookup, the TCP handshake and the
// TLS handshake all wait for the first <img> to be parsed. On 2G that is seconds before a byte.
export function MediaOriginHint() {
  ReactDOM.preconnect(MEDIA_ORIGIN);
  ReactDOM.prefetchDNS(MEDIA_ORIGIN);
  return null;
}
