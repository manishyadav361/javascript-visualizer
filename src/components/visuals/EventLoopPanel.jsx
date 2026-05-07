import { motion } from "framer-motion";
export function EventLoopPanel({ phase, activeTask, callStackSize, icon, active }) {
  const isDraining = phase === "microtask" || phase === "macrotask";

  return (
    <section
      className={`min-h-0 rounded-md border bg-app-bg/45 p-3 transition ${
        active ? "border-app-active shadow-[0_0_18px_rgb(242_204_96/0.14)]" : "border-app-border"
      }`}
    >
      <div className="mb-2 flex h-6 items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">Event Loop</h3>
        <span className="text-app-active">{icon}</span>
      </div>
      <div className="grid min-h-[210px] place-items-center">
        <div className="relative grid size-32 place-items-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-app-border"
            animate={{ rotate: 360 }}
            transition={{ duration: isDraining ? 2 : 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-dashed border-app-active/60"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-center">
            <p className="text-sm font-semibold text-app-strong">{phase}</p>
            <p className="mt-1 text-[11px] text-app-muted">{activeTask ?? "polling"}</p>
          </div>
        </div>
        <div className="mt-2 grid w-full grid-cols-2 gap-2 text-xs">
          <div className="rounded border border-app-border bg-app-bg/45 px-2 py-2">
            <span className="text-app-muted">stack</span>
            <strong className="float-right text-app-stack">{callStackSize}</strong>
          </div>
          <div className="rounded border border-app-border bg-app-bg/45 px-2 py-2">
            <span className="text-app-muted">mode</span>
            <strong className="float-right text-app-active">{isDraining ? "drain" : "wait"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
