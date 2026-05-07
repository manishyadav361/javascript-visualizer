import { parse } from "acorn";
import { cloneState, createInitialRuntimeState, makeStep } from "./runtimeState.js";

function lineOf(node) {
  return node?.loc?.start?.line ?? 1;
}

function compactCode(code, node) {
  return code.slice(node.start, node.end).replace(/\s+/g, " ").trim();
}

function literalName(node, code) {
  if (!node) return "value";
  if (node.type === "Identifier") return node.name;
  if (node.type === "Literal") return JSON.stringify(node.value);
  if (node.type === "BinaryExpression") return compactCode(code, node);
  if (node.type === "CallExpression") return compactCode(code, node);
  return compactCode(code, node);
}

function expressionValue(node, code, env = {}) {
  if (!node) return "undefined";
  if (node.type === "Literal") return node.value;
  if (node.type === "Identifier") return env[node.name] ?? node.name;
  if (node.type === "BinaryExpression" && node.operator === "+") {
    return `${expressionValue(node.left, code, env)}${expressionValue(node.right, code, env)}`;
  }
  return literalName(node, code);
}

function getConsoleArgument(node, code, env) {
  const arg = node?.arguments?.[0];
  const value = expressionValue(arg, code, env);
  return typeof value === "string" ? value : JSON.stringify(value);
}

function isConsoleLog(node) {
  return (
    node?.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    node.callee.object?.name === "console" &&
    ["log", "warn", "error"].includes(node.callee.property?.name)
  );
}

function isSetTimeout(node) {
  return node?.type === "CallExpression" && node.callee?.name === "setTimeout";
}

function isPromiseThen(node) {
  return (
    node?.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    node.callee.property?.name === "then"
  );
}

function firstCallbackBody(callExpression) {
  const callback = callExpression.arguments?.[0];
  return callback?.body?.type === "BlockStatement" ? callback.body.body : [];
}

function createFrame(id, name, line, variables = {}) {
  return {
    id,
    name,
    line,
    variables,
    context: `${name} Execution Context`
  };
}

function appendLog(state, { line, message, origin = "sync", type = "log" }) {
  state.logs.push({
    id: `log-${state.logs.length + 1}`,
    step: state.logs.length + 1,
    line,
    message,
    origin,
    type
  });
}

function markLine(state, line, phase = "execute") {
  state.currentLine = line;
  state.phase = phase;
  state.activePanel = panelForPhase(phase);
  if (!state.executedLines.includes(line)) {
    state.executedLines.push(line);
  }
}

function panelForPhase(phase) {
  if (phase === "webapi") return "webapis";
  if (phase === "microtask") return "event-loop";
  if (phase === "macrotask") return "event-loop";
  if (phase === "hoist") return "memory";
  if (phase === "execute") return "memory";
  if (phase === "context") return "call-stack";
  if (phase === "sync") return "call-stack";
  if (phase === "complete") return "event-loop";
  return "code";
}

function emitConsoleStep(steps, statement, code, origin = "sync", env = {}) {
  const call = statement.expression ?? statement;
  const line = lineOf(statement);
  steps.push(
    makeStep({
      id: `console-${steps.length + 1}`,
      label: `console.${call.callee.property.name}`,
      line,
      phase: origin,
      detail: getConsoleArgument(call, code, env),
      apply(state) {
        markLine(state, line, origin);
        state.activeTask = origin;
        appendLog(state, {
          line,
          message: getConsoleArgument(call, code, env),
          origin,
          type: call.callee.property.name
        });
      }
    })
  );
}

function emitStatements(steps, statements, code, origin = "sync", env = {}) {
  statements.forEach((statement) => {
    if (statement.type === "ExpressionStatement" && isConsoleLog(statement.expression)) {
      emitConsoleStep(steps, statement, code, origin, env);
    }
  });
}

function createSteps(code) {
  const steps = [];
  let ast;

  try {
    ast = parse(code, {
      ecmaVersion: "latest",
      sourceType: "script",
      locations: true
    });
  } catch (error) {
    return [
      makeStep({
        id: "parse-error",
        label: "Parse error",
        line: error.loc?.line ?? 1,
        phase: "error",
        detail: error.message,
        apply(state) {
          markLine(state, error.loc?.line ?? 1, "error");
          appendLog(state, {
            line: error.loc?.line ?? 1,
            message: error.message,
            origin: "sync",
            type: "error"
          });
        }
      })
    ];
  }

  const functions = new Map();
  const globalEnv = {};
  const pendingMicrotasks = [];
  const pendingMacrotasks = [];

  steps.push(
    makeStep({
      id: "global-context",
      label: "Create global execution context",
      line: 1,
      phase: "context",
      detail: "Hoist declarations and initialize the global scope.",
      apply(state) {
        markLine(state, 1, "context");
        state.callStack.push(createFrame("global-frame", "Global", 1));
      }
    })
  );

  ast.body.forEach((node) => {
    if (node.type === "FunctionDeclaration") {
      const line = lineOf(node);
      functions.set(node.id.name, node);
      steps.push(
        makeStep({
          id: `hoist-${node.id.name}`,
          label: `Hoist function ${node.id.name}`,
          line,
          phase: "hoist",
          detail: `${node.id.name} is available before runtime execution reaches its declaration.`,
          apply(state) {
            markLine(state, line, "hoist");
            state.executionContexts[0].variables[node.id.name] = "function";
            state.heap.push({
              id: `fn-${node.id.name}`,
              label: node.id.name,
              type: "function",
              value: `function ${node.id.name}()`,
              refs: ["global"],
              active: true
            });
          }
        })
      );
    }
  });

  ast.body.forEach((node) => {
    const line = lineOf(node);

    if (node.type === "VariableDeclaration") {
      node.declarations.forEach((declarationNode) => {
        const value = expressionValue(declarationNode.init, code, globalEnv);
        globalEnv[declarationNode.id.name] = value;
        steps.push(
          makeStep({
            id: `global-${declarationNode.id.name}-${line}`,
            label: `Declare ${declarationNode.id.name}`,
            line,
            phase: "execute",
            detail: `${declarationNode.id.name} = ${value}`,
            apply(state) {
              markLine(state, line, "execute");
              state.executionContexts[0].variables[declarationNode.id.name] = value;
              const globalFrame = state.callStack.find((frame) => frame.id === "global-frame");
              if (globalFrame) globalFrame.variables[declarationNode.id.name] = value;
              state.heap.push({
                id: `global-primitive-${declarationNode.id.name}-${line}`,
                label: declarationNode.id.name,
                type: "primitive",
                value,
                refs: ["global"],
                active: true
              });
            }
          })
        );
      });
    }

    if (node.type === "ExpressionStatement" && isConsoleLog(node.expression)) {
      emitConsoleStep(steps, node, code, "sync", globalEnv);
    }

    if (node.type === "ExpressionStatement" && isSetTimeout(node.expression)) {
      const callbackBody = firstCallbackBody(node.expression);
      steps.push(
        makeStep({
          id: `webapi-timeout-${line}`,
          label: "Register setTimeout callback",
          line,
          phase: "webapi",
          detail: "Timer moves to Web APIs, then enqueues a macrotask.",
          apply(state) {
            markLine(state, line, "webapi");
            state.webApis.push({
              id: `timer-${line}`,
              label: "setTimeout",
              status: "waiting",
              line,
              remaining: "0ms"
            });
          }
        })
      );
      steps.push(
        makeStep({
          id: `macro-timeout-${line}`,
          label: "Enqueue timeout macrotask",
          line,
          phase: "macrotask",
          detail: "The timer callback waits until the stack is empty and microtasks are drained.",
          apply(state) {
            markLine(state, line, "macrotask");
            state.webApis = state.webApis.map((api) =>
              api.id === `timer-${line}` ? { ...api, status: "complete" } : api
            );
            state.macrotasks.push({
              id: `timeout-task-${line}`,
              label: "setTimeout callback",
              line
            });
          }
        })
      );
      pendingMacrotasks.push({ line, callbackBody });
    }

    if (node.type === "ExpressionStatement" && isPromiseThen(node.expression)) {
      const callbackBody = firstCallbackBody(node.expression);
      steps.push(
        makeStep({
          id: `micro-promise-${line}`,
          label: "Enqueue Promise reaction",
          line,
          phase: "microtask",
          detail: "Promise callbacks enter the microtask queue and run before macrotasks.",
          apply(state) {
            markLine(state, line, "microtask");
            state.microtasks.push({
              id: `promise-task-${line}`,
              label: "Promise.then callback",
              line
            });
          }
        })
      );
      pendingMicrotasks.push({ line, callbackBody });
    }

    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.type === "Identifier" &&
      functions.has(node.expression.callee.name)
    ) {
      const declaration = functions.get(node.expression.callee.name);
      const functionName = declaration.id.name;
      const env = {};
      declaration.params.forEach((param, index) => {
        env[param.name] = expressionValue(node.expression.arguments[index], code, globalEnv);
      });
      steps.push(
        makeStep({
          id: `call-${functionName}-${line}`,
          label: `Call ${functionName}()`,
          line,
          phase: "context",
          detail: `Create a function execution context for ${functionName}.`,
          apply(state) {
            markLine(state, line, "context");
            state.callStack.push(createFrame(`frame-${functionName}-${line}`, functionName, line, env));
            state.executionContexts.push({
              id: `ctx-${functionName}-${line}`,
              name: `${functionName} Execution Context`,
              type: "function",
              variables: env,
              scopeChain: [`${functionName} Lexical Environment`, "Global Lexical Environment"]
            });
          }
        })
      );
      declaration.body.body.forEach((statement) => {
        const statementLine = lineOf(statement);
        if (statement.type === "VariableDeclaration") {
          const declarationNode = statement.declarations[0];
          const value = expressionValue(declarationNode.init, code, env);
          env[declarationNode.id.name] = value;
          steps.push(
            makeStep({
              id: `local-${functionName}-${declarationNode.id.name}-${statementLine}`,
              label: `Declare ${declarationNode.id.name}`,
              line: statementLine,
              phase: "execute",
              detail: `${declarationNode.id.name} = ${value}`,
              apply(state) {
                markLine(state, statementLine, "execute");
                const frame = state.callStack.find((item) => item.id === `frame-${functionName}-${line}`);
                if (frame) frame.variables[declarationNode.id.name] = value;
                const context = state.executionContexts.find((item) => item.id === `ctx-${functionName}-${line}`);
                if (context) context.variables[declarationNode.id.name] = value;
                state.heap.push({
                  id: `primitive-${declarationNode.id.name}-${statementLine}`,
                  label: declarationNode.id.name,
                  type: "primitive",
                  value,
                  refs: [functionName],
                  active: true
                });
              }
            })
          );
        }
        if (statement.type === "ExpressionStatement" && isConsoleLog(statement.expression)) {
          emitConsoleStep(steps, statement, code, "sync", env);
        }
      });
      steps.push(
        makeStep({
          id: `return-${functionName}-${line}`,
          label: `Return from ${functionName}()`,
          line,
          phase: "context",
          apply(state) {
            markLine(state, line, "context");
            state.callStack = state.callStack.filter((frame) => frame.id !== `frame-${functionName}-${line}`);
          }
        })
      );
    }
  });

  pendingMicrotasks.forEach(({ line, callbackBody }) => {
    steps.push(
      makeStep({
        id: `run-promise-${line}`,
        label: "Drain microtask",
        line,
        phase: "microtask",
        detail: "The event loop drains microtasks after the current stack completes.",
        apply(state) {
          markLine(state, line, "microtask");
          state.activeTask = "microtask";
          state.microtasks = state.microtasks.filter((task) => task.id !== `promise-task-${line}`);
          state.callStack.push(createFrame(`promise-frame-${line}`, "Promise.then callback", line));
        }
      })
    );
    emitStatements(steps, callbackBody, code, "microtask");
    steps.push(
      makeStep({
        id: `pop-promise-${line}`,
        label: "Complete promise callback",
        line,
        phase: "microtask",
        apply(state) {
          markLine(state, line, "microtask");
          state.callStack = state.callStack.filter((frame) => frame.id !== `promise-frame-${line}`);
        }
      })
    );
  });

  pendingMacrotasks.forEach(({ line, callbackBody }) => {
    steps.push(
      makeStep({
        id: `run-timeout-${line}`,
        label: "Run timeout macrotask",
        line,
        phase: "macrotask",
        detail: "The event loop moves the macrotask onto the call stack after microtasks are drained.",
        apply(state) {
          markLine(state, line, "macrotask");
          state.activeTask = "macrotask";
          state.macrotasks = state.macrotasks.filter((task) => task.id !== `timeout-task-${line}`);
          state.callStack.push(createFrame(`timeout-frame-${line}`, "setTimeout callback", line));
        }
      })
    );
    emitStatements(steps, callbackBody, code, "macrotask");
    steps.push(
      makeStep({
        id: `pop-timeout-${line}`,
        label: "Complete timeout callback",
        line,
        phase: "macrotask",
        apply(state) {
          markLine(state, line, "macrotask");
          state.callStack = state.callStack.filter((frame) => frame.id !== `timeout-frame-${line}`);
        }
      })
    );
  });

  steps.push(
    makeStep({
      id: "global-complete",
      label: "Global script complete",
      line: Math.max(1, code.split("\n").length),
      phase: "complete",
      detail: "The global frame leaves the call stack after queued callbacks complete.",
      apply(state) {
        markLine(state, Math.max(1, code.split("\n").length), "complete");
        state.callStack = state.callStack.filter((frame) => frame.id !== "global-frame");
        state.heap = state.heap.map((node) => ({ ...node, active: false }));
        state.activeTask = null;
      }
    })
  );

  return steps;
}

export function compileSimulation(code) {
  const steps = createSteps(code);
  const initialState = createInitialRuntimeState();
  const snapshots = [cloneState(initialState)];
  let state = cloneState(initialState);

  steps.forEach((step) => {
    const next = cloneState(state);
    step.apply(next);
    snapshots.push(next);
    state = next;
  });

  return { steps, snapshots };
}
