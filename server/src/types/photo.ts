export interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  blurHash: string | null;
}

export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  blur_hash: string | null;
  urls: {
    raw: string;
  };
}
