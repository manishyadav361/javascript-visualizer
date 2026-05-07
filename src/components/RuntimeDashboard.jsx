import { Box, Braces, Layers3, RadioTower } from "lucide-react";
import { useRuntimeStore } from "../store/runtimeStore";
import { CallStackPanel } from "./visuals/CallStackPanel";
import { EventLoopSection } from "./visuals/EventLoopSection";
import { ExecutionContextPanel } from "./visuals/ExecutionContextPanel";
import { HeapPanel } from "./visuals/HeapPanel";
import { WebApisPanel } from "./visuals/WebApisPanel";

export function RuntimeDashboard() {
  const snapshot = useRuntimeStore((state) => state.snapshots[state.stepIndex]);
  const activePanel = snapshot.activePanel;

  return (
    <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
      <div className="grid min-h-0 gap-4">
        <CallStackPanel
          frames={snapshot.callStack}
          active={activePanel === "call-stack"}
          icon={<Layers3 size={15} />}
        />
        <EventLoopSection snapshot={snapshot} active={activePanel === "event-loop"} />
      </div>
      <div className="grid min-h-0 grid-cols-1 gap-4">
        <HeapPanel nodes={snapshot.heap} active={activePanel === "memory"} icon={<Box size={15} />} />
        <ExecutionContextPanel
          contexts={snapshot.executionContexts}
          active={activePanel === "memory" || activePanel === "call-stack"}
          icon={<Braces size={15} />}
        />
        <WebApisPanel apis={snapshot.webApis} active={activePanel === "webapis"} icon={<RadioTower size={15} />} />
      </div>
    </div>
  );
}
