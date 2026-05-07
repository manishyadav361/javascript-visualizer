export const EXAMPLES = [
  {
    id: "event-loop",
    title: "Event Loop Basics",
    topic: "Async fundamentals",
    summary: "Sync code runs first, Promise microtasks run next, timers run last.",
    code: `console.log("script start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("script end");`
  },
  {
    id: "call-stack",
    title: "Call Stack",
    topic: "Functions",
    summary: "Function calls push frames onto the stack and returns pop them off.",
    code: `function greet(name) {
  const message = "hello " + name;
  console.log(message);
}

greet("Ada");
console.log("done");`
  },
  {
    id: "hoisting",
    title: "Hoisting",
    topic: "Execution context",
    summary: "Function declarations are registered while the global context is created.",
    code: `sayHi("Lin");

function sayHi(name) {
  const message = "hi " + name;
  console.log(message);
}

console.log("after call");`
  },
  {
    id: "memory",
    title: "Variables & Heap",
    topic: "Memory",
    summary: "Declarations allocate values and expose them in the current context.",
    code: `const language = "JavaScript";
const level = "beginner";

function describe(name) {
  const label = name + " runtime";
  console.log(label);
}

describe(language);
console.log(level);`
  },
  {
    id: "promises",
    title: "Promise Priority",
    topic: "Microtasks",
    summary: "Promise callbacks wait in the microtask queue and beat timer callbacks.",
    code: `console.log("A");

setTimeout(() => {
  console.log("timer");
}, 0);

Promise.resolve().then(() => {
  console.log("microtask 1");
});

Promise.resolve().then(() => {
  console.log("microtask 2");
});

console.log("B");`
  },
  {
    id: "web-apis",
    title: "Timer Web API",
    topic: "Browser APIs",
    summary: "setTimeout is registered with Web APIs before its callback becomes a macrotask.",
    code: `console.log("schedule timer");

setTimeout(() => {
  console.log("timer callback");
}, 1000);

console.log("keep running");`
  },
  {
    id: "closures",
    title: "Closure Setup",
    topic: "Scope chain",
    summary: "Nested functions keep a reference to the outer lexical environment.",
    code: `function makeCounter(start) {
  const count = start;
  console.log("created counter");
}

makeCounter(1);
console.log("outer scope stays available");`
  }
];

export const DEFAULT_EXAMPLE = EXAMPLES[0];
