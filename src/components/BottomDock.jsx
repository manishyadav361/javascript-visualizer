import { AlertTriangle, Bug, ChevronDown, CircleAlert, CircleCheck, Terminal } from "lucide-react";
import { useState } from "react";
import { useRuntimeStore } from "../store/runtimeStore";

const logIcons = {
  log: <CircleCheck size={14} />,
  warn: <AlertTriangle size={14} />,
  error: <CircleAlert size={14} />
};

const originStyles = {
  sync: "border-app-stack/50 text-app-stack",
  microtask: "border-app-micro/50 text-app-micro",
  macrotask: "border-app-macro/50 text-app-macro"
};

export function BottomDock() {
  const [activeDock, setActiveDock] = useState(null);
  const stepIndex = useRuntimeStore((state) => state.stepIndex);
  const steps = useRuntimeStore((state) => state.steps);
  const snapshot = useRuntimeStore((state) => state.snapshots[state.stepIndex]);
  const jumpToStep = useRuntimeStore((state) => state.jumpToStep);
  const jumpToLog = useRuntimeStore((state) => state.jumpToLog);
  const selectedLogStep = useRuntimeStore((state) => state.selectedLogStep);
  const currentStep = steps[stepIndex - 1];
  const isOpen = Boolean(activeDock);

  function toggleDock(nextDock) {
    setActiveDock((current) => (current === nextDock ? null : nextDock));
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-xl border border-app-border bg-app-panel/95 shadow-[0_18px_50px_rgb(15_23_42/0.18)] backdrop-blur">
        <div className="flex h-12 items-center justify-between gap-2 border-b border-app-border/70 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => toggleDock("timeline")}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                activeDock === "timeline"
                  ? "border-app-active bg-app-active/15 text-app-strong"
                  : "border-transparent text-app-muted hover:border-app-border hover:text-app-strong"
              }`}
            >
              <Bug size={14} /> Timeline
            </button>
            <button
              type="button"
              onClick={() => toggleDock("console")}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                activeDock === "console"
                  ? "border-app-active bg-app-active/15 text-app-strong"
                  : "border-transparent text-app-muted hover:border-app-border hover:text-app-strong"
              }`}
            >
              <Terminal size={14} /> Console
              <span className="rounded-full bg-app-panelSoft px-2 py-0.5 text-[11px] text-app-muted">
                {snapshot.logs.length}
              </span>
            </button>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden truncate text-xs text-app-muted sm:block">
              {activeDock === "console" ? `${snapshot.logs.length} console entries` : currentStep?.label ?? "Initial state"}
            </span>
            <button
              type="button"
              onClick={() => setActiveDock(null)}
              className="grid size-8 place-items-center rounded-md border border-app-border text-app-muted transition hover:text-app-strong"
              title="Close dock"
            >
              <ChevronDown className={isOpen ? "" : "rotate-180"} size={16} />
            </button>
          </div>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? "grid-rows-[minmax(220px,34vh)]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            {activeDock === "timeline" ? (
              <TimelineDock
                steps={steps}
                stepIndex={stepIndex}
                currentStep={currentStep}
                jumpToStep={jumpToStep}
              />
            ) : null}
            {activeDock === "console" ? (
              <ConsoleDock
                snapshot={snapshot}
                jumpToLog={jumpToLog}
                selectedLogStep={selectedLogStep}
              />
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}

function TimelineDock({ steps, stepIndex, currentStep, jumpToStep }) {
  return (
    <section className="grid h-full grid-rows-[auto_auto_1fr] gap-3 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-app-strong">{currentStep?.label ?? "Initial state"}</span>
        <span className="text-xs text-app-muted">
          {stepIndex}/{steps.length}
        </span>
      </div>
          <input
            type="range"
            min="0"
            max={steps.length}
            value={stepIndex}
            onChange={(event) => jumpToStep(Number(event.target.value))}
            className="h-2 w-full accent-app-active"
            title="Timeline scrubber"
          />
      <div className="grid min-h-0 grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-2 overflow-auto pr-1 scrollbar-thin">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => jumpToStep(index + 1)}
                className={`min-h-[58px] rounded-md border p-2 text-left text-xs transition ${
                  stepIndex === index + 1
                    ? "border-app-active bg-app-active/12 text-app-strong"
                    : "border-app-border bg-app-bg/45 text-app-muted hover:border-app-stack hover:text-app-text"
                }`}
                title={step.detail || step.label}
              >
                <span className="block text-[10px] uppercase tracking-[0.12em] text-app-muted">{step.phase}</span>
                <span className="line-clamp-2">{step.label}</span>
              </button>
            ))}
          </div>
    </section>
  );
}

function ConsoleDock({ snapshot, jumpToLog, selectedLogStep }) {
  return (
    <section className="h-full overflow-auto p-3 scrollbar-thin">
      {snapshot.logs.length === 0 ? (
        <div className="grid h-full min-h-[180px] place-items-center rounded-md border border-dashed border-app-border bg-app-panelSoft text-xs text-app-muted">
          waiting for output
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {snapshot.logs.map((log) => (
            <button
              key={log.id}
              type="button"
              onClick={() => jumpToLog(log)}
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition ${
                selectedLogStep === log.id
                  ? "border-app-active bg-app-active/10"
                  : "border-app-border bg-app-bg/45 hover:border-app-stack"
              }`}
            >
              <span className={log.type === "error" ? "text-red-500" : log.type === "warn" ? "text-app-macro" : "text-app-micro"}>
                {logIcons[log.type] ?? logIcons.log}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-app-text">{log.message}</span>
                <span className="text-app-muted">
                  step {log.step} · line {log.line}
                </span>
              </span>
              <span className={`rounded border px-2 py-1 text-[11px] ${originStyles[log.origin]}`}>
                {log.origin}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
