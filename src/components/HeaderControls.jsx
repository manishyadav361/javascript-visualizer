import { BookOpen, FastForward, Gauge, GraduationCap, Moon, Pause, Play, RotateCcw, SkipBack, SkipForward, Sun } from "lucide-react";
import { useRuntimeStore } from "../store/runtimeStore";

export function HeaderControls({ isDark, toggleTheme }) {
  const examples = useRuntimeStore((state) => state.examples);
  const route = useRuntimeStore((state) => state.route);
  const selectedExampleId = useRuntimeStore((state) => state.selectedExampleId);
  const isPlaying = useRuntimeStore((state) => state.isPlaying);
  const stepIndex = useRuntimeStore((state) => state.stepIndex);
  const steps = useRuntimeStore((state) => state.steps);
  const speed = useRuntimeStore((state) => state.speed);
  const togglePlayback = useRuntimeStore((state) => state.togglePlayback);
  const previousStep = useRuntimeStore((state) => state.previousStep);
  const nextStep = useRuntimeStore((state) => state.nextStep);
  const reset = useRuntimeStore((state) => state.reset);
  const setSpeed = useRuntimeStore((state) => state.setSpeed);
  const loadExample = useRuntimeStore((state) => state.loadExample);
  const navigate = useRuntimeStore((state) => state.navigate);

  const currentStep = steps[stepIndex - 1];
  const selectedExample = examples.find((example) => example.id === selectedExampleId);

  return (
    <header className="grid min-h-[84px] shrink-0 grid-cols-1 gap-3 border-b border-app-border bg-app-bg/92 px-4 py-3 backdrop-blur xl:grid-cols-[minmax(220px,0.7fr)_auto_minmax(360px,1fr)_auto] xl:items-center">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-normal text-app-strong">JavaScript Visualizer</h1>
        <p className="truncate text-xs text-app-muted">
          {currentStep?.label ?? "Ready"} {currentStep?.detail ? `- ${currentStep.detail}` : ""}
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("visualizer")}
          className={`rounded-md border px-3 py-2 text-sm transition ${
            route === "visualizer"
              ? "border-app-active bg-app-active/12 text-app-strong"
              : "border-app-border bg-app-panel text-app-muted hover:border-app-stack hover:text-app-text"
          }`}
        >
          Visualizer
        </button>
        <button
          type="button"
          onClick={() => navigate("practice")}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
            route === "practice"
              ? "border-app-active bg-app-active/12 text-app-strong"
              : "border-app-border bg-app-panel text-app-muted hover:border-app-stack hover:text-app-text"
          }`}
        >
          <GraduationCap size={16} />
          Practice
        </button>
      </div>

      {route === "visualizer" ? (
      <label className="flex min-w-0 items-center gap-3 rounded-lg border border-app-border bg-app-panel px-3 py-2">
        <BookOpen className="shrink-0 text-app-active" size={17} />
        <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-app-muted sm:block">
          Example
        </span>
        <select
          value={selectedExampleId === "custom" ? "" : selectedExampleId}
          onChange={(event) => loadExample(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-app-text outline-none"
          title="Choose JavaScript concept"
        >
          {selectedExampleId === "custom" ? <option value="">Custom code</option> : null}
          {examples.map((example) => (
            <option key={example.id} value={example.id}>
              {example.title} - {example.topic}
            </option>
          ))}
        </select>
        <span className="hidden max-w-[280px] truncate text-xs text-app-muted lg:block">
          {selectedExample?.summary ?? "Edit code to create a custom visualization."}
        </span>
      </label>
      ) : (
        <div className="min-w-0 rounded-lg border border-app-border bg-app-panel px-3 py-2">
          <p className="truncate text-sm font-medium text-app-strong">Output practice</p>
          <p className="truncate text-xs text-app-muted">Topic-wise questions from easy to hard for interview depth.</p>
        </div>
      )}

      <div className={`items-center justify-end gap-2 ${route === "visualizer" ? "flex" : "hidden xl:flex"}`}>
        <button
          type="button"
          onClick={reset}
          className="grid size-9 place-items-center rounded-md border border-app-border bg-app-panel text-app-muted transition hover:border-app-active hover:text-app-active"
          title="Reset"
        >
          <RotateCcw size={17} />
        </button>
        <button
          type="button"
          onClick={previousStep}
          className="grid size-9 place-items-center rounded-md border border-app-border bg-app-panel text-app-muted transition hover:border-app-stack hover:text-app-stack"
          title="Step back"
        >
          <SkipBack size={17} />
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          className="grid size-10 place-items-center rounded-md border border-app-active bg-app-active text-app-strong shadow-glow transition hover:brightness-110"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="grid size-9 place-items-center rounded-md border border-app-border bg-app-panel text-app-muted transition hover:border-app-stack hover:text-app-stack"
          title="Step forward"
        >
          <SkipForward size={17} />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="grid size-9 place-items-center rounded-md border border-app-border bg-app-panel text-app-muted transition hover:border-app-stack hover:text-app-text"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <label className="ml-2 hidden items-center gap-2 rounded-md border border-app-border bg-app-panel px-3 py-2 text-xs text-app-muted md:flex">
          <Gauge size={15} />
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="bg-transparent text-app-text outline-none"
            title="Playback speed"
          >
            <option value={1300}>0.75x</option>
            <option value={900}>1x</option>
            <option value={520}>1.75x</option>
            <option value={260}>3x</option>
          </select>
        </label>
        <div className="hidden items-center gap-2 rounded-md border border-app-border bg-app-panel px-3 py-2 text-xs text-app-muted lg:flex">
          <FastForward size={15} />
          <span>
            {stepIndex}/{steps.length}
          </span>
        </div>
      </div>
    </header>
  );
}
