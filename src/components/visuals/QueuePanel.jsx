import { AnimatePresence, motion } from "framer-motion";
import { InfoIcon } from "../InfoIcon";
import { EmptyState } from "./EmptyState";

const QUEUE_DESCRIPTIONS = {
  "Microtask Queue": "Executes Promises, async/await, and queueMicrotask callbacks. These have higher priority and run before macrotasks. Important for understanding asynchronous code flow.",
  "Macrotask Queue": "Contains setTimeout, setInterval, setImmediate, I/O operations. Lower priority than microtasks. The event loop alternates: one macrotask, then all pending microtasks.",
};

export function QueuePanel({ title, accent, color, items, icon, active, compact = false }) {
  const infoDescription = QUEUE_DESCRIPTIONS[title];
  
  return (
    <section
      className={`min-h-0 rounded-md border bg-app-bg/45 p-3 transition ${
        active ? "border-app-active shadow-[0_0_18px_rgb(242_204_96/0.14)]" : "border-app-border"
      }`}
    >
      <div className={`mb-2 flex h-6 items-center justify-between border-b ${accent} pb-2`}>
        <div className="flex items-center gap-2">
          <h3 className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">{title}</h3>
          {infoDescription && <InfoIcon title={title} description={infoDescription} />}
        </div>
        <span className={color}>{icon}</span>
      </div>
      <div className={`flex flex-col gap-3 overflow-auto pr-1 scrollbar-thin ${compact ? "max-h-[216px]" : "min-h-[160px]"}`}>
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="rounded-md border border-app-border bg-app-bg/55 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-app-strong">{item.label}</h3>
                <span className="text-[11px] text-app-muted">#{index + 1}</span>
              </div>
              <p className="mt-1 text-xs text-app-muted">source line {item.line}</p>
            </motion.article>
          ))}
        </AnimatePresence>
        {items.length === 0 ? <EmptyState label="queue empty" /> : null}
      </div>
    </section>
  );
}
