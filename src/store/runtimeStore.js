import { create } from "zustand";
import { DEFAULT_EXAMPLE, EXAMPLES } from "../engine/examples.js";
import { compileSimulation } from "../engine/simulator.js";
import { DEFAULT_CODE } from "../engine/runtimeState.js";

const compiled = compileSimulation(DEFAULT_CODE);

export const useRuntimeStore = create((set, get) => ({
  code: DEFAULT_CODE,
  examples: EXAMPLES,
  selectedExampleId: DEFAULT_EXAMPLE.id,
  steps: compiled.steps,
  snapshots: compiled.snapshots,
  stepIndex: 0,
  isPlaying: false,
  speed: 900,
  selectedLogStep: null,
  route: window.location.pathname === "/practice" ? "practice" : "visualizer",

  get snapshot() {
    return get().snapshots[get().stepIndex];
  },

  setCode(code) {
    const next = compileSimulation(code);
    set({
      code,
      selectedExampleId: "custom",
      steps: next.steps,
      snapshots: next.snapshots,
      stepIndex: 0,
      isPlaying: false,
      selectedLogStep: null
    });
  },

  visualizeCode(code) {
    const next = compileSimulation(code);
    window.history.pushState({}, "", "/");
    set({
      route: "visualizer",
      code,
      selectedExampleId: "custom",
      steps: next.steps,
      snapshots: next.snapshots,
      stepIndex: 0,
      isPlaying: false,
      selectedLogStep: null
    });
  },

  navigate(route) {
    const path = route === "practice" ? "/practice" : "/";
    window.history.pushState({}, "", path);
    set({ route, isPlaying: false });
  },

  loadExample(exampleId) {
    const example = get().examples.find((item) => item.id === exampleId);
    if (!example) return;
    const next = compileSimulation(example.code);
    set({
      code: example.code,
      selectedExampleId: example.id,
      steps: next.steps,
      snapshots: next.snapshots,
      stepIndex: 0,
      isPlaying: false,
      selectedLogStep: null
    });
  },

  reset() {
    set({ stepIndex: 0, isPlaying: false, selectedLogStep: null });
  },

  play() {
    set({ isPlaying: true });
  },

  pause() {
    set({ isPlaying: false });
  },

  togglePlayback() {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setSpeed(speed) {
    set({ speed });
  },

  nextStep() {
    set((state) => {
      const nextIndex = Math.min(state.stepIndex + 1, state.snapshots.length - 1);
      return {
        stepIndex: nextIndex,
        isPlaying: nextIndex === state.snapshots.length - 1 ? false : state.isPlaying
      };
    });
  },

  previousStep() {
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
      isPlaying: false
    }));
  },

  jumpToStep(stepIndex) {
    set((state) => ({
      stepIndex: Math.max(0, Math.min(stepIndex, state.snapshots.length - 1)),
      isPlaying: false
    }));
  },

  jumpToLog(log) {
    set({ stepIndex: Math.min(log.step, get().snapshots.length - 1), selectedLogStep: log.id, isPlaying: false });
  }
}));
