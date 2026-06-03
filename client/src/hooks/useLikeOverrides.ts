import { useState } from 'react';

export function useLikeOverrides() {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const isLiked = (id: string, serverLiked: boolean) => overrides[id] ?? serverLiked;

  const toggleLike = (id: string, serverLiked: boolean) =>
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? serverLiked) }));

  return { isLiked, toggleLike };
}
