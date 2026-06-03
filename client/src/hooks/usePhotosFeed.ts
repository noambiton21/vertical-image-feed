import { useQuery } from '@tanstack/react-query';
import { fetchPhotos } from '../api/photos.api.js';
import { FIRST_PAGE } from '../constants.js';

export function usePhotosFeed() {
  const query = useQuery({
    queryKey: ['photos', FIRST_PAGE],
    queryFn: () => fetchPhotos(FIRST_PAGE),
  });

  return {
    photos: query.data?.items ?? [],
    isLoading: query.isPending,
    isError: query.isError,
  };
}
