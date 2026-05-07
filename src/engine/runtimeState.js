import { DEFAULT_EXAMPLE } from "./examples.js";

export const DEFAULT_CODE = DEFAULT_EXAMPLE.code;

export function createInitialRuntimeState() {
  return {
    callStack: [],
    heap: [],
    microtasks: [],
    macrotasks: [],
    webApis: [],
    logs: [],
    currentLine: 1,
    executionContexts: [
      {
        id: "global",
        name: "Global Execution Context",
        type: "global",
        variables: {},
        scopeChain: ["Global Lexical Environment"]
      }
    ],
    executedLines: [],
    activeTask: null,
    activePanel: "code",
    phase: "parse"
  };
}

export function cloneState(state) {
  return structuredClone(state);
}

export function makeStep({ id, label, line, phase = "execute", detail = "", apply }) {
  return {
    id,
    label,
    line,
    phase,
    detail,
    apply
  };
}
