import { AnimatePresence, motion } from "framer-motion";
import { Panel } from "../Panel";
import { EmptyState } from "./EmptyState";

const CALL_STACK_INFO = {
  title: "Call Stack",
  description: "Tracks function calls as they execute. When a function is called, it's pushed onto the stack. When it returns, it's popped off. The topmost frame is the currently executing function. LIFO (Last In, First Out) data structure.",
};

export function CallStackPanel({ frames, icon, active }) {
  return (
    <Panel
      title="Call Stack"
      accent="border-app-stack"
      active={active}
      action={<span className="text-app-stack">{icon}</span>}
      info={CALL_STACK_INFO}
    >
      <div className="flex h-full min-h-[112px] flex-col-reverse gap-2 overflow-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {frames.map((frame, index) => (
            <motion.article
              key={frame.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 18, scale: 0.96 }}
              className={`rounded-md border bg-app-bg/55 p-3 ${
                index === frames.length - 1 ? "border-app-active bg-app-active/10" : "border-app-stack/45"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-app-strong">{frame.name}</h3>
                <span className="shrink-0 text-[11px] text-app-muted">line {frame.line}</span>
              </div>
              <p className="mt-1 truncate text-xs text-app-muted">{frame.context}</p>
              {Object.keys(frame.variables ?? {}).length > 0 ? (
                <div className="mt-2 grid gap-1 text-xs">
                  {Object.entries(frame.variables).map(([name, value]) => (
                    <div key={name} className="flex justify-between gap-2 rounded bg-app-panelSoft px-2 py-1">
                      <span className="text-app-stack">{name}</span>
                      <span className="truncate text-app-text">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.article>
          ))}
        </AnimatePresence>
        {frames.length === 0 ? <EmptyState label="stack clear" /> : null}
      </div>
    </Panel>
  );
}
