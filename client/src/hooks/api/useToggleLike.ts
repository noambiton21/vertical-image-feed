import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { likePhoto, unlikePhoto } from '../../api/photos.api';
import { queryKeys } from '../../lib/queryKeys';
import { flipLikedInPages } from '../../lib/flipLikedInPages';
import type { PhotoPage } from '../../types/photo';

interface ToggleLikeVars {
  id: string;
  liked: boolean;
}

interface ToggleLikeContext {
  previous: InfiniteData<PhotoPage> | undefined;
}

const LIKE_SCOPE = 'toggle-like';
const LIKE_MUTATION_KEY = [LIKE_SCOPE] as const;

// In onError the failing mutation is still counted as in flight, so a count of 1
// means it's the only one left and rolling back won't clobber a newer queued tap.
const ONLY_THIS_MUTATION = 1;

export function useToggleLike(onError?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, ToggleLikeVars, ToggleLikeContext>({
    scope: { id: LIKE_SCOPE },
    mutationKey: LIKE_MUTATION_KEY,
    mutationFn: ({ id, liked }) => (liked ? likePhoto(id) : unlikePhoto(id)),
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.photosFeed });
      const previous = queryClient.getQueryData<InfiniteData<PhotoPage>>(queryKeys.photosFeed);
      queryClient.setQueryData<InfiniteData<PhotoPage>>(queryKeys.photosFeed, (data) =>
        flipLikedInPages(data, id, liked),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      const isLastPending =
        queryClient.isMutating({ mutationKey: LIKE_MUTATION_KEY }) <= ONLY_THIS_MUTATION;
      if (isLastPending && context) {
        queryClient.setQueryData(queryKeys.photosFeed, context.previous);
      }
      onError?.();
    },
  });
}
