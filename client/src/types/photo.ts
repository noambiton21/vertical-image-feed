export interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  blurHash: string | null;
  liked: boolean;
}

export interface PhotoPage {
  page: number;
  perPage: number;
  items: Photo[];
}

export interface LikeResult {
  id: string;
  liked: boolean;
}
