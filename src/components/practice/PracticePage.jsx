import { ArrowRight, CheckCircle2, Filter, Search, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { analyzePracticeAnswer } from "../../practice/analyzeAnswer.js";
import {
  PRACTICE_DIFFICULTIES,
  PRACTICE_MODULES,
  PRACTICE_QUESTIONS,
  PRACTICE_TOPICS
} from "../../practice/practiceQuestions.js";
import { useRuntimeStore } from "../../store/runtimeStore.js";

const difficultyStyles = {
  Easy: "border-app-micro/50 text-app-micro",
  Medium: "border-app-active/50 text-app-active",
  Hard: "border-app-macro/50 text-app-macro"
};

export function PracticePage() {
  const visualizeCode = useRuntimeStore((state) => state.visualizeCode);
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(PRACTICE_QUESTIONS[0].id);
  const [output, setOutput] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [result, setResult] = useState(null);

  const questions = useMemo(() => {
    return PRACTICE_QUESTIONS.filter((question) => {
      const matchesTopic = topic === "All" || question.topic === topic;
      const matchesDifficulty = difficulty === "All" || question.difficulty === difficulty;
      const search = `${question.title} ${question.topic} ${question.code}`.toLowerCase();
      return matchesTopic && matchesDifficulty && search.includes(query.toLowerCase());
    });
  }, [difficulty, query, topic]);

  const selectedQuestion =
    PRACTICE_QUESTIONS.find((question) => question.id === selectedId) ?? questions[0] ?? PRACTICE_QUESTIONS[0];
  const selectedModule = PRACTICE_MODULES.find((module) => module.topic === selectedQuestion.topic);
  const topicCount = PRACTICE_QUESTIONS.filter((question) => question.topic === selectedQuestion.topic).length;

  function selectQuestion(question) {
    setSelectedId(question.id);
    setOutput("");
    setReasoning("");
    setResult(null);
  }

  function analyze() {
    setResult(analyzePracticeAnswer(selectedQuestion, output, reasoning));
  }

  return (
    <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto p-4 scrollbar-thin xl:grid-cols-[340px_minmax(0,1fr)] xl:overflow-hidden">
      <aside className="min-h-[420px] overflow-hidden rounded-xl border border-app-border bg-app-panel shadow-sm xl:min-h-0">
        <div className="border-b border-app-border p-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-app-strong">Practice Set</h2>
            <span className="rounded-full bg-app-panelSoft px-2 py-1 text-xs text-app-muted">
              {PRACTICE_QUESTIONS.length} questions
            </span>
          </div>
          <p className="mt-1 text-xs text-app-muted">Module-wise output practice for 3-4 YOE interviews.</p>
        </div>
        <div className="space-y-3 border-b border-app-border p-3">
          <label className="flex items-center gap-2 rounded-md border border-app-border bg-app-bg/45 px-3 py-2">
            <Search size={15} className="text-app-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              className="min-w-0 flex-1 bg-transparent text-sm text-app-text outline-none placeholder:text-app-muted"
            />
          </label>
          <label className="flex items-center gap-2 rounded-md border border-app-border bg-app-bg/45 px-3 py-2">
            <Filter size={15} className="text-app-muted" />
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-app-text outline-none"
            >
              <option>All</option>
              {PRACTICE_TOPICS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDifficulty("All")}
              className={`rounded-md border px-2 py-2 text-xs transition ${
                difficulty === "All"
                  ? "border-app-active bg-app-active/10 text-app-strong"
                  : "border-app-border text-app-muted hover:border-app-stack"
              }`}
            >
              All levels
            </button>
            {PRACTICE_DIFFICULTIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={`rounded-md border px-2 py-2 text-xs transition ${
                  difficulty === item
                    ? "border-app-active bg-app-active/10 text-app-strong"
                    : "border-app-border text-app-muted hover:border-app-stack"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[calc(100%-14.5rem)] min-h-[240px] overflow-auto p-2 scrollbar-thin">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => selectQuestion(question)}
              className={`mb-2 w-full rounded-md border p-3 text-left transition ${
                selectedQuestion.id === question.id
                  ? "border-app-active bg-app-active/10"
                  : "border-app-border bg-app-bg/35 hover:border-app-stack"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-app-strong">{question.title}</h3>
                <span className={`shrink-0 rounded border px-2 py-0.5 text-[11px] ${difficultyStyles[question.difficulty]}`}>
                  {question.difficulty}
                </span>
              </div>
              <p className="mt-1 text-xs text-app-muted">{question.topic}</p>
            </button>
          ))}
          {questions.length === 0 ? (
            <div className="grid min-h-[160px] place-items-center rounded-md border border-dashed border-app-border text-xs text-app-muted">
              No questions match this filter.
            </div>
          ) : null}
        </div>
      </aside>

      <div className="grid min-h-[720px] grid-cols-1 gap-4 overflow-visible xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_380px] xl:overflow-hidden">
        <section className="min-h-[640px] overflow-hidden rounded-xl border border-app-border bg-app-panel shadow-sm xl:min-h-0">
          <div className="flex items-start justify-between gap-3 border-b border-app-border p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-app-strong">{selectedQuestion.title}</h2>
                <span className={`rounded border px-2 py-1 text-xs ${difficultyStyles[selectedQuestion.difficulty]}`}>
                  {selectedQuestion.difficulty}
                </span>
                <span className="rounded border border-app-border px-2 py-1 text-xs text-app-muted">
                  {selectedQuestion.topic}
                </span>
              </div>
              <p className="mt-2 text-sm text-app-muted">
                Predict the console output, then explain the execution order and the JavaScript rule behind it.
              </p>
              <div className="mt-3 rounded-lg border border-app-border bg-app-panelSoft px-3 py-2 text-sm text-app-muted">
                <span className="font-semibold text-app-strong">{selectedQuestion.topic}</span>
                <span className="mx-2 text-app-muted">·</span>
                <span>{topicCount} questions</span>
                {selectedModule?.intro ? <p className="mt-1 leading-5">{selectedModule.intro}</p> : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => visualizeCode(selectedQuestion.code)}
              className="flex shrink-0 items-center gap-2 rounded-md border border-app-stack bg-app-stack/10 px-3 py-2 text-sm text-app-stack transition hover:bg-app-stack/20"
            >
              Visualize
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid h-[calc(100%-9.2rem)] min-h-[520px] grid-rows-[minmax(220px,0.9fr)_minmax(260px,1fr)] gap-3 overflow-auto p-3 scrollbar-thin">
            <pre className="min-h-0 overflow-auto rounded-md border border-app-border bg-app-code p-4 font-mono text-sm leading-6 text-app-text scrollbar-thin">
              <code>{selectedQuestion.code}</code>
            </pre>
            <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-2">
              <label className="flex min-h-0 flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">Your output</span>
                <textarea
                  value={output}
                  onChange={(event) => setOutput(event.target.value)}
                  placeholder={"Write each console output on a new line.\nExample:\nA\nC\nB"}
                  className="min-h-0 flex-1 resize-none rounded-md border border-app-border bg-app-bg/55 p-3 font-mono text-sm leading-6 text-app-text outline-none placeholder:text-app-muted focus:border-app-active"
                />
              </label>
              <label className="flex min-h-0 flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">Why?</span>
                <textarea
                  value={reasoning}
                  onChange={(event) => setReasoning(event.target.value)}
                  placeholder="Explain call stack, hoisting, references, microtasks, macrotasks, this binding, or the key mechanism."
                  className="min-h-0 flex-1 resize-none rounded-md border border-app-border bg-app-bg/55 p-3 text-sm leading-6 text-app-text outline-none placeholder:text-app-muted focus:border-app-active"
                />
              </label>
            </div>
          </div>
        </section>

        <aside className="min-h-[420px] overflow-hidden rounded-xl border border-app-border bg-app-panel shadow-sm xl:min-h-0">
          <div className="border-b border-app-border p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-app-strong">
              <Sparkles size={16} className="text-app-active" />
              Reasoning Review
            </h2>
            <p className="mt-1 text-xs text-app-muted">Checks output order and whether your explanation names the right mechanism.</p>
          </div>
          <div className="h-[calc(100%-4.8rem)] space-y-3 overflow-auto p-3 scrollbar-thin">
            <button
              type="button"
              onClick={analyze}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-app-active bg-app-active px-3 py-2 text-sm font-semibold text-app-strong transition hover:brightness-110"
            >
              <Send size={16} />
              Analyze answer
            </button>

            {result ? (
              <div className="space-y-3">
                <div className="rounded-md border border-app-border bg-app-bg/45 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-app-strong">{result.verdict}</p>
                    <span className="rounded border border-app-active/50 px-2 py-1 text-sm text-app-active">
                      {result.score}/100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-app-muted">{result.feedback}</p>
                </div>
                <ReviewBlock title="Expected" lines={result.expected} />
                <ReviewBlock title="You wrote" lines={result.actual.length ? result.actual : ["No output provided"]} />
                <div className="rounded-md border border-app-border bg-app-bg/45 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">Reasoning signals</p>
                  {result.matchedKeywords.length ? (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {result.matchedKeywords.map((keyword) => (
                        <span key={keyword} className="flex items-center gap-1 rounded border border-app-micro/40 px-2 py-1 text-xs text-app-micro">
                          <CheckCircle2 size={12} />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="text-sm text-app-muted">
                    {result.misses.length
                      ? `Consider mentioning: ${result.misses.join(", ")}.`
                      : "Nice. Your reasoning mentions the important concepts."}
                  </p>
                </div>
                <div className="rounded-md border border-app-stack/40 bg-app-stack/10 p-3 text-sm text-app-muted">
                  <span className="font-semibold text-app-stack">Model reasoning: </span>
                  {selectedQuestion.explanation}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-app-border p-4 text-sm text-app-muted">
                Submit your predicted output and explanation. I’ll compare the exact order and check whether the reasoning points at the right JS concept.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ReviewBlock({ title, lines }) {
  return (
    <div className="rounded-md border border-app-border bg-app-bg/45 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">{title}</p>
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} className="rounded bg-app-panelSoft px-2 py-1 font-mono text-sm text-app-text">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
