interface CenteredStateProps {
  children: React.ReactNode;
}

export function CenteredState({ children }: CenteredStateProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg px-10 text-center text-white">
      {children}
    </div>
  );
}
