import { motion } from "framer-motion";
import { Panel } from "../Panel";

export function ExecutionContextPanel({ contexts, icon, active }) {
  return (
    <Panel
      title="Scope"
      accent="border-app-active"
      active={active}
      action={<span className="text-app-active">{icon}</span>}
    >
      <div className="max-h-[150px] min-h-[96px] space-y-2 overflow-auto pr-1 scrollbar-thin">
        {contexts.map((context) => (
          <motion.article
            layout
            key={context.id}
            className="rounded-md border border-app-border bg-app-bg/55 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-app-strong">{context.name}</h3>
              <span className="text-[11px] text-app-muted">{context.type}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {context.scopeChain.map((scope) => (
                <span key={scope} className="rounded bg-app-panelSoft px-2 py-1 text-[11px] text-app-muted">
                  {scope}
                </span>
              ))}
            </div>
            <div className="mt-2 grid gap-1">
              {Object.entries(context.variables).map(([name, value]) => (
                <div key={name} className="flex justify-between gap-2 rounded border border-app-border px-2 py-1 text-xs">
                  <span className="text-app-active">{name}</span>
                  <span className="truncate text-app-text">{String(value)}</span>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Panel>
  );
}
