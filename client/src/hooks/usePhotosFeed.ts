import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPhotos } from '../api/photos.api.js';
import { FIRST_PAGE } from '../constants.js';
import { queryKeys } from '../lib/queryKeys.js';
import { ApiError } from '../lib/api.js';

export function usePhotosFeed() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.photosFeed,
    queryFn: ({ pageParam }) => fetchPhotos(pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === lastPage.perPage ? lastPage.page + 1 : undefined,
  });

  const errorCode = query.error instanceof ApiError ? query.error.code : undefined;
  const hasLoadedPages = (query.data?.pages.length ?? 0) > 0;

  return {
    photos: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    errorCode,
    nextPageError: query.isError && hasLoadedPages ? errorCode : undefined,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
