import { decode } from 'blurhash';
import { BLURHASH_DECODE_SIZE } from '../constants';

export function blurHashToDataUrl(hash: string | null): string | null {
  if (!hash) return null;

  const canvas = document.createElement('canvas');
  canvas.width = BLURHASH_DECODE_SIZE;
  canvas.height = BLURHASH_DECODE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const pixels = decode(hash, BLURHASH_DECODE_SIZE, BLURHASH_DECODE_SIZE);
  const imageData = ctx.createImageData(BLURHASH_DECODE_SIZE, BLURHASH_DECODE_SIZE);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}
