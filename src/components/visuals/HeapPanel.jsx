import { AnimatePresence, motion } from "framer-motion";
import { Panel } from "../Panel";
import { EmptyState } from "./EmptyState";

export function HeapPanel({ nodes, icon, active }) {
  return (
    <Panel
      title="Memory"
      accent="border-app-heap"
      active={active}
      action={<span className="text-app-heap">{icon}</span>}
    >
      <div className="grid max-h-[150px] min-h-[96px] grid-cols-1 gap-2 overflow-auto pr-1 scrollbar-thin sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {nodes.map((node) => (
            <motion.article
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className={`rounded-md border bg-app-bg/55 p-3 ${
                node.active ? "border-app-heap shadow-[0_0_18px_rgb(188_140_255/0.15)]" : "border-app-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-app-strong">{node.label}</h3>
                <span className="text-[11px] text-app-heap">{node.type}</span>
              </div>
              <p className="mt-2 truncate rounded bg-app-panelSoft px-2 py-1 font-mono text-xs text-app-text">
                {String(node.value)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(node.refs ?? []).map((ref) => (
                  <span key={ref} className="rounded border border-app-heap/35 px-2 py-0.5 text-[11px] text-app-muted">
                    ref: {ref}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {nodes.length === 0 ? <EmptyState label="no allocations yet" /> : null}
      </div>
    </Panel>
  );
}
