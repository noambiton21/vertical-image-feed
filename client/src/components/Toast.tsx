interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute bottom-[34px] left-1/2 z-10 -translate-x-1/2 animate-fadeUp rounded-full bg-black/70 px-[18px] py-[10px] text-[13.5px] font-medium text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
    >
      {message}
    </div>
  );
}
