export function EmptyState({ label = "empty" }) {
  return (
    <div className="grid min-h-[72px] place-items-center rounded-md border border-dashed border-app-border bg-app-bg/35 text-xs text-app-muted">
      {label}
    </div>
  );
}
