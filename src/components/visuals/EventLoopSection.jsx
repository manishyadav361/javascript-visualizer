import { Activity, Clock3 } from "lucide-react";
import { Panel } from "../Panel";
import { EventLoopPanel } from "./EventLoopPanel";
import { QueuePanel } from "./QueuePanel";

export function EventLoopSection({ snapshot, active }) {
  return (
    <Panel
      title="Event Loop & Queues"
      accent={active ? "border-app-active" : "border-app-border"}
      active={active}
      className="min-h-0"
      action={<span className="text-xs text-app-muted">microtasks run before macrotasks</span>}
    >
      <div className="grid h-full min-h-[260px] grid-cols-1 gap-4 overflow-visible pr-1 scrollbar-thin lg:grid-cols-[minmax(190px,0.72fr)_minmax(240px,1fr)_minmax(240px,1fr)] lg:overflow-visible">
        <EventLoopPanel
          phase={snapshot.phase}
          activeTask={snapshot.activeTask}
          callStackSize={snapshot.callStack.length}
          active={active}
          icon={<Activity size={15} />}
        />
        <QueuePanel
          title="Microtask Queue"
          accent="border-app-micro"
          color="text-app-micro"
          items={snapshot.microtasks}
          active={snapshot.phase === "microtask"}
          compact
          icon={<Clock3 size={15} />}
        />
        <QueuePanel
          title="Macrotask Queue"
          accent="border-app-macro"
          color="text-app-macro"
          items={snapshot.macrotasks}
          active={snapshot.phase === "macrotask"}
          compact
          icon={<Clock3 size={15} />}
        />
      </div>
    </Panel>
  );
}
