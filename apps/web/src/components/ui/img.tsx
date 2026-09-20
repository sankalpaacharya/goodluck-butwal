import { assetSrcSet, assetUrl, type Quality } from "@/lib/utils/media-url";

type Props = Omit<React.ComponentProps<"img">, "src" | "alt"> & { src: string; alt: string; w?: number; widths?: readonly number[]; quality?: Quality };

// A card is never the full window: the container pads 16px each side on a phone. Declaring 100vw
// asked for a width the card cannot use and pushed the browser a rung up the ladder.
// A 1x1 gif costs nothing and stands in for a picture whose only <source> is desktop-only, so a
// phone downloads none of it.
export const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const CARD_SIZES = "(min-width: 1200px) 33vw, (min-width: 810px) 50vw, calc(100vw - 32px)";

// `widths` is for something far smaller than the 320 the default ladder starts at.
export function Img({ src, alt, w = 960, widths, quality, sizes, ...rest }: Props) {
  return <img {...rest} alt={alt} src={assetUrl(src, w, quality)} srcSet={sizes ? assetSrcSet(src, widths, quality) : undefined} sizes={sizes} />;
}
