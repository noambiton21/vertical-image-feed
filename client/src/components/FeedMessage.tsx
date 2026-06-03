interface FeedMessageProps {
  children: React.ReactNode;
}

export function FeedMessage({ children }: FeedMessageProps) {
  return (
    <div className="grid h-[100dvh] place-items-center bg-bg text-sm text-white/60">{children}</div>
  );
}
