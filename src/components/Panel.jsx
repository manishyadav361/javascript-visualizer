export function Panel({ title, accent = "border-app-border", action, children, className = "", active = false }) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-lg border bg-app-panel transition duration-300 ${
        active
          ? "border-app-active shadow-[0_0_0_1px_rgb(242_204_96/0.3),0_0_26px_rgb(242_204_96/0.12)]"
          : "border-app-border"
      } ${className}`}
    >
      <div className={`flex h-10 items-center justify-between border-b ${accent} px-3`}>
        <h2 className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-app-muted">{title}</h2>
        {action}
      </div>
      <div className="h-[calc(100%-2.5rem)] min-h-0 overflow-auto p-3">{children}</div>
    </section>
  );
}
