export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="size-2 animate-bounce rounded-full bg-foreground/60" />
      <div
        className="size-2 animate-bounce rounded-full bg-foreground/60"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="size-2 animate-bounce rounded-full bg-foreground/60"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
