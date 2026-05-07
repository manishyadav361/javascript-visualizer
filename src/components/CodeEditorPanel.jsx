import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useRef } from "react";
import { useRuntimeStore } from "../store/runtimeStore";
import { Panel } from "./Panel";

export function CodeEditorPanel({ theme }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const code = useRuntimeStore((state) => state.code);
  const setCode = useRuntimeStore((state) => state.setCode);
  const snapshot = useRuntimeStore((state) => state.snapshots[state.stepIndex]);
  const isPlaying = useRuntimeStore((state) => state.isPlaying);
  const isActive = snapshot.activePanel === "code";

  const markerLines = useMemo(() => {
    return {
      currentLine: snapshot.currentLine,
      executedLines: snapshot.executedLines
    };
  }, [snapshot.currentLine, snapshot.executedLines]);

  function updateDecorations(editor, monaco, lines) {
    const decorations = [
      ...lines.executedLines.map((line) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: "executed-line"
        }
      })),
      {
        range: new monaco.Range(lines.currentLine, 1, lines.currentLine, 1),
        options: {
          isWholeLine: true,
          className: "current-line",
          glyphMarginClassName: "line-marker"
        }
      }
    ];
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
    editor.revealLineInCenterIfOutsideViewport(lines.currentLine);
  }

  useEffect(() => {
    if (!editorRef.current) return;
    updateDecorations(editorRef.current.editor, editorRef.current.monaco, markerLines);
  }, [markerLines]);

  return (
    <Panel
      title="Code Editor"
      accent="border-app-stack"
      className="flex flex-col"
      active={isActive}
      action={<span className="text-xs text-app-muted">{isPlaying ? "read-only" : "editable"}</span>}
    >
      <div className="h-full min-h-[280px] overflow-hidden rounded-md border border-app-border">
        <Editor
          height="100%"
          language="javascript"
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
            lineHeight: 22,
            glyphMargin: true,
            folding: false,
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
            readOnly: isPlaying,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
          onChange={(value) => setCode(value ?? "")}
          onMount={(editor, monaco) => {
            editorRef.current = { editor, monaco };
            updateDecorations(editor, monaco, markerLines);
          }}
        />
      </div>
    </Panel>
  );
}
