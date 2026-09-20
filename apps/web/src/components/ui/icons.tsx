import type { SVGProps } from "react";

// The paths are the files from public/images/ui, with a viewBox added so CSS can size them.
type Icon = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

export const Arrow: Icon = (props) => (
  <svg viewBox="0 0 13 9" width="13" height="9" fill="none" aria-hidden {...props}>
    <path fill="#1D1D1D" d="M12.06 4.045 8.17.156a.556.556 0 0 0-.785.786l2.94 2.94H.556a.556.556 0 1 0 0 1.111h9.77l-2.94 2.94a.555.555 0 1 0 .786.786L12.06 4.83a.555.555 0 0 0 0-.785Z" />
  </svg>
);

export const ArrowLeft: Icon = (props) => (
  <svg viewBox="0 0 13 9" width="13" height="9" fill="none" aria-hidden {...props}>
    <path fill="#1D1D1D" d="m.94 4.955 3.89 3.889a.556.556 0 0 0 .785-.786l-2.94-2.94h9.77a.556.556 0 1 0 0-1.111h-9.77l2.94-2.94A.555.555 0 1 0 4.829.28L.941 4.17a.555.555 0 0 0 0 .785Z" />
  </svg>
);

export const Star: Icon = (props) => (
  <svg viewBox="0 0 19 18" width="19" height="18" fill="none" aria-hidden {...props}>
    <path fill="#FB0" d="m18.699 6.875-6.795-.447L9.347 0l-2.56 6.428L0 6.875l5.206 4.42L3.497 18l5.849-3.697L15.194 18l-1.708-6.705 5.213-4.42Z" />
  </svg>
);

export const Stars5: Icon = (props) => (
  <svg viewBox="0 0 182 30" width="182" height="30" fill="none" {...props}>
    <path fill="#FB0" d="m15.8 0 4.873 9.884 10.893 1.566-7.9 7.692L25.546 30 15.8 24.884 6.02 30 7.9 19.142 0 11.45l10.928-1.566L15.8 0Zm37.532 0 4.873 9.884 10.927 1.566-7.9 7.692L63.077 30l-9.745-5.116L43.587 30l1.845-10.858-7.866-7.692L48.46 9.884 53.332 0Zm37.601 0 4.873 9.884 10.893 1.566-7.9 7.692L100.678 30l-9.745-5.116L81.153 30l1.88-10.858-7.9-7.692 10.893-1.566L90.933 0Zm37.532 0 4.872 9.884 10.928 1.566-7.9 7.692L138.21 30l-9.745-5.116L118.72 30l1.845-10.858-7.866-7.692 10.893-1.566L128.465 0Zm37.601 0 4.872 9.884 10.894 1.566-7.9 7.692L175.811 30l-9.745-5.116L156.287 30l1.879-10.858-7.9-7.692 10.893-1.566L166.066 0Z" />
  </svg>
);

export const Bolt: Icon = (props) => (
  <svg viewBox="0 0 13 20" width="13" height="20" fill="none" aria-hidden {...props}>
    <path fill="#F44336" fillRule="evenodd" d="M.134 19.944A.313.313 0 0 0 .54 19.9L12.33 7.306a.312.312 0 0 0-.227-.526H7.759L11.34.467A.313.313 0 0 0 11.068 0H6.402a.312.312 0 0 0-.269.153L.065 10.385a.313.313 0 0 0 .269.472H4.4l-4.367 8.69a.313.313 0 0 0 .1.397Z" clipRule="evenodd" />
  </svg>
);

export const Heart: Icon = (props) => (
  <svg viewBox="0 0 20 18" width="20" height="18" fill="none" aria-hidden {...props}>
    <path fill="#F9595F" d="M18.846 2.272C18.13 1.244 17.118.509 15.974.184a4.86 4.86 0 0 0-3.439.3c-.97.457-1.834 1.228-2.535 2.25C9.299 1.71 8.434.94 7.465.484a4.86 4.86 0 0 0-3.439-.3C2.882.51 1.87 1.244 1.154 2.272.4 3.352 0 4.704 0 6.179 0 8.3 1.158 10.629 3.443 13.1c1.86 2.014 4.06 3.663 5.206 4.467.403.282.872.432 1.351.432s.948-.15 1.351-.432c1.145-.804 3.345-2.453 5.206-4.467C18.842 10.631 20 8.301 20 6.18c0-1.475-.4-2.826-1.154-3.907Z" />
  </svg>
);

export const Chevron: Icon = (props) => (
  <svg viewBox="0 0 9 14" width="9" height="14" fill="none" aria-hidden {...props}>
    <path fill="#10B981" d="M.369 12.898a1.334 1.334 0 0 1-.253-1.464c.072-.16.175-.304.303-.425l4.506-4.26L.651 2.256A1.336 1.336 0 1 1 2.591.417l5.18 5.462a1.332 1.332 0 0 1-.05 1.89l-5.463 5.18a1.333 1.333 0 0 1-1.89-.05Z" />
  </svg>
);
