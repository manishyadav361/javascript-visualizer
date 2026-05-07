import { AnimatePresence, motion } from "framer-motion";
import { Panel } from "../Panel";
import { EmptyState } from "./EmptyState";

const WEB_APIS_INFO = {
  title: "Web APIs",
  description: "Browser APIs like setTimeout, fetch, event listeners, etc. When called, they're delegated to the browser and execute asynchronously. Callbacks return to queues when the operation completes. Important for understanding async patterns in JavaScript.",
};

export function WebApisPanel({ apis, icon, active }) {
  const registeredApis = apis.filter((api) => api.status === "waiting");

  return (
    <Panel
      title="Web APIs"
      accent="border-app-macro"
      active={active}
      className="h-full min-h-[240px]"
      action={<span className="text-app-macro">{icon}</span>}
      info={WEB_APIS_INFO}
    >
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {registeredApis.map((api) => (
            <motion.article
              key={api.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-app-macro/45 bg-app-bg/55 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-app-strong">{api.label}</h3>
                <span className="text-[11px] text-app-muted">line {api.line}</span>
              </div>
              <p className="mt-2 text-xs text-app-muted">registered</p>
            </motion.article>
          ))}
        </AnimatePresence>
        {registeredApis.length === 0 ? (
          <div className="grid flex-1 place-items-center">
            <EmptyState label="browser APIs wait here" />
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
