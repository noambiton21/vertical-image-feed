export interface PhotoBase {
  id: string;
  url: string;
  width: number;
  height: number;
  blurHash: string | null;
}

export interface PhotoResponse extends PhotoBase {
  liked: boolean;
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
