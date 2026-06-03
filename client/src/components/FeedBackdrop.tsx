import { BACKDROP_IMAGE_WIDTH } from '../constants.js';
import { withWidth } from '../lib/imageUrl.js';

interface FeedBackdropProps {
  url: string;
}

export function FeedBackdrop({ url }: FeedBackdropProps) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className="absolute inset-0 scale-125 bg-cover bg-center [filter:blur(38px)_brightness(.55)_saturate(1.2)]"
        style={{ backgroundImage: `url(${withWidth(url, BACKDROP_IMAGE_WIDTH)})` }}
      />
      <div className="absolute inset-0 bg-backdrop-veil" />
    </div>
  );
}
