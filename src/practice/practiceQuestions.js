export const PRACTICE_MODULES = [
  {
    topic: "Execution Context & Call Stack",
    intro:
      "JavaScript runs code by creating execution contexts that are pushed onto a single-threaded call stack. This explains function order and stack overflow."
  },
  {
    topic: "Lexical Scope & Scope Chain",
    intro:
      "Scope is decided where code is written, not where it is called. Variable lookup walks outward through the scope chain."
  },
  {
    topic: "Hoisting & TDZ",
    intro:
      "Declarations are hoisted, but initialization differs across var, let, const, and function declarations."
  },
  {
    topic: "Closures",
    intro:
      "A closure lets a function remember variables from its lexical scope after that outer scope has finished."
  },
  {
    topic: "this Binding",
    intro:
      "this is determined by how a function is called, not where it is defined. Arrow functions are the major exception."
  },
  {
    topic: "Type Coercion & Equality",
    intro:
      "JavaScript performs implicit conversions depending on operators, especially ==, +, and object-to-primitive conversion."
  },
  {
    topic: "Truthy/Falsy & Logical Operators",
    intro:
      "Logical operators short-circuit and return operands, not always booleans."
  },
  {
    topic: "Event Loop",
    intro:
      "Synchronous code runs first, then microtasks, then macrotasks such as timers."
  },
  {
    topic: "Promises & Async/Await",
    intro:
      "async/await is promise syntax over microtasks. await pauses the async function and resumes later."
  },
  {
    topic: "Objects, Prototypes & Inheritance",
    intro:
      "JavaScript resolves missing properties by walking an object's prototype chain."
  },
  {
    topic: "Memory & Garbage Collection",
    intro:
      "Objects are garbage-collected when no reachable reference can access them."
  },
  {
    topic: "Common Edge Cases",
    intro:
      "Interview favorites test careful mental models around historical quirks and special values."
  }
];

export const PRACTICE_TOPICS = PRACTICE_MODULES.map((module) => module.topic);

export const PRACTICE_DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const PRACTICE_QUESTIONS = [
  {
    id: "m1-q1",
    topic: "Execution Context & Call Stack",
    difficulty: "Easy",
    title: "Top-to-bottom sync execution",
    code: `console.log("start");
console.log("end");`,
    expectedOutput: ["start", "end"],
    reasoningKeywords: ["synchronous", "top to bottom", "execution context"],
    explanation: "Synchronous code executes top to bottom in the same global execution context."
  },
  {
    id: "m1-q2",
    topic: "Execution Context & Call Stack",
    difficulty: "Easy",
    title: "Function creates a stack frame",
    code: `function foo() {
  console.log("foo");
}

foo();`,
    expectedOutput: ["foo"],
    reasoningKeywords: ["function", "execution context", "call stack", "push"],
    explanation: "Calling foo creates a new function execution context and pushes it onto the call stack."
  },
  {
    id: "m1-q3",
    topic: "Execution Context & Call Stack",
    difficulty: "Medium",
    title: "Nested call stack",
    code: `function a() {
  b();
}

function b() {
  console.log("b");
}

a();`,
    expectedOutput: ["b"],
    reasoningKeywords: ["global", "a", "b", "call stack", "pop"],
    explanation: "The stack order is global -> a -> b. b logs, then b and a pop off the stack."
  },
  {
    id: "m1-q4",
    topic: "Execution Context & Call Stack",
    difficulty: "Medium",
    title: "Return values through the stack",
    code: `function x() {
  return y();
}

function y() {
  return z();
}

function z() {
  return "done";
}

console.log(x());`,
    expectedOutput: ["done"],
    reasoningKeywords: ["return", "propagate", "call stack", "z"],
    explanation: "z returns done to y, y returns it to x, and x returns it to console.log."
  },
  {
    id: "m1-q5",
    topic: "Execution Context & Call Stack",
    difficulty: "Hard",
    title: "Infinite recursion",
    code: `function recurse() {
  recurse();
}

recurse();`,
    expectedOutput: ["RangeError: Maximum call stack size exceeded"],
    reasoningKeywords: ["recursion", "call stack", "overflow", "rangeerror"],
    explanation: "Each recursive call pushes another frame. With no base case, the stack overflows."
  },
  {
    id: "m2-q1",
    topic: "Lexical Scope & Scope Chain",
    difficulty: "Easy",
    title: "Read from global lexical scope",
    code: `let x = 10;

function foo() {
  console.log(x);
}

foo();`,
    expectedOutput: ["10"],
    reasoningKeywords: ["lexical", "global", "scope chain", "lookup"],
    explanation: "foo cannot find x locally, so lookup continues to its lexical parent, the global scope."
  },
  {
    id: "m2-q2",
    topic: "Lexical Scope & Scope Chain",
    difficulty: "Medium",
    title: "Inner reads outer scope",
    code: `function outer() {
  let x = 20;
  function inner() {
    console.log(x);
  }
  inner();
}

outer();`,
    expectedOutput: ["20"],
    reasoningKeywords: ["inner", "outer", "scope chain", "closure"],
    explanation: "inner resolves x through outer's lexical environment."
  },
  {
    id: "m2-q3",
    topic: "Lexical Scope & Scope Chain",
    difficulty: "Medium",
    title: "Variable shadowing",
    code: `let x = 5;

function test() {
  let x = 10;
  console.log(x);
}

test();`,
    expectedOutput: ["10"],
    reasoningKeywords: ["shadow", "local", "scope", "lookup"],
    explanation: "The local x inside test shadows the outer x."
  },
  {
    id: "m2-q4",
    topic: "Lexical Scope & Scope Chain",
    difficulty: "Hard",
    title: "Lexical scope, runtime value",
    code: `function foo() {
  console.log(x);
}

let x = 10;
foo();`,
    expectedOutput: ["10"],
    reasoningKeywords: ["lexical", "execution", "lookup", "initialized"],
    explanation: "foo's scope is fixed lexically, but x is read when foo executes, after x has been initialized."
  },
  {
    id: "m2-q5",
    topic: "Lexical Scope & Scope Chain",
    difficulty: "Hard",
    title: "Function-level TDZ",
    code: `function foo() {
  console.log(x);
  let x = 10;
}

foo();`,
    expectedOutput: ["ReferenceError"],
    reasoningKeywords: ["let", "tdz", "function scope", "referenceerror"],
    explanation: "The let binding exists in foo's scope but is in the temporal dead zone until the declaration executes."
  },
  {
    id: "m3-q1",
    topic: "Hoisting & TDZ",
    difficulty: "Easy",
    title: "var hoisted as undefined",
    code: `console.log(a);
var a = 10;`,
    expectedOutput: ["undefined"],
    reasoningKeywords: ["var", "hoisted", "undefined", "assignment"],
    explanation: "var is hoisted and initialized to undefined. Assignment happens later."
  },
  {
    id: "m3-q2",
    topic: "Hoisting & TDZ",
    difficulty: "Medium",
    title: "Function declaration hoisting",
    code: `foo();

function foo() {
  console.log("hello");
}`,
    expectedOutput: ["hello"],
    reasoningKeywords: ["function declaration", "hoisted", "creation phase"],
    explanation: "Function declarations are fully hoisted, so foo is callable before its declaration line."
  },
  {
    id: "m3-q3",
    topic: "Hoisting & TDZ",
    difficulty: "Medium",
    title: "Function expression with var",
    code: `foo();

var foo = () => console.log("hi");`,
    expectedOutput: ["TypeError"],
    reasoningKeywords: ["var", "undefined", "not a function", "typeerror"],
    explanation: "foo exists as undefined at call time, so calling it throws TypeError."
  },
  {
    id: "m3-q4",
    topic: "Hoisting & TDZ",
    difficulty: "Hard",
    title: "let temporal dead zone",
    code: `console.log(a);
let a = 10;`,
    expectedOutput: ["ReferenceError"],
    reasoningKeywords: ["let", "tdz", "referenceerror", "initialization"],
    explanation: "TDZ prevents reading a let binding before initialization."
  },
  {
    id: "m3-q5",
    topic: "Hoisting & TDZ",
    difficulty: "Hard",
    title: "Block-scoped TDZ",
    code: `{
  console.log(x);
  const x = 5;
}`,
    expectedOutput: ["ReferenceError"],
    reasoningKeywords: ["const", "block", "tdz", "referenceerror"],
    explanation: "const is block-scoped and cannot be accessed before its declaration initializes it."
  },
  {
    id: "m4-q1",
    topic: "Closures",
    difficulty: "Easy",
    title: "Function remembers argument",
    code: `function greet(name) {
  return function () {
    return "Hi " + name;
  };
}

const sayHi = greet("A");
console.log(sayHi());`,
    expectedOutput: ["Hi A"],
    reasoningKeywords: ["closure", "name", "lexical", "remember"],
    explanation: "The returned inner function retains access to name through closure."
  },
  {
    id: "m4-q2",
    topic: "Closures",
    difficulty: "Medium",
    title: "Persistent private state",
    code: `function counter() {
  let count = 0;
  return () => ++count;
}

const c = counter();
console.log(c());
console.log(c());`,
    expectedOutput: ["1", "2"],
    reasoningKeywords: ["closure", "state", "count", "persist"],
    explanation: "count stays reachable through the returned function, so it persists between calls."
  },
  {
    id: "m4-q3",
    topic: "Closures",
    difficulty: "Medium",
    title: "var loop closure",
    code: `let fns = [];

for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}

console.log(fns.map(fn => fn()));`,
    expectedOutput: ["[3, 3, 3]"],
    reasoningKeywords: ["var", "single binding", "closure", "loop"],
    explanation: "var creates one shared i binding. All functions read that same binding after the loop ends."
  },
  {
    id: "m4-q4",
    topic: "Closures",
    difficulty: "Hard",
    title: "let loop closure",
    code: `let fns = [];

for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}

console.log(fns.map(fn => fn()));`,
    expectedOutput: ["[0, 1, 2]"],
    reasoningKeywords: ["let", "new binding", "iteration", "closure"],
    explanation: "let creates a fresh binding for each loop iteration, so each closure remembers a different i."
  },
  {
    id: "m4-q5",
    topic: "Closures",
    difficulty: "Hard",
    title: "once utility",
    code: `function once(fn) {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      return fn();
    }
  };
}

const runOnce = once(() => "done");
console.log(runOnce(), runOnce());`,
    expectedOutput: ["done undefined"],
    reasoningKeywords: ["closure", "called", "state", "undefined"],
    explanation: "The closure tracks called. The first call returns done; the second reaches no return value, so it is undefined."
  },
  {
    id: "m5-q1",
    topic: "this Binding",
    difficulty: "Easy",
    title: "Global this",
    code: `console.log(this);`,
    expectedOutput: ["window / global"],
    reasoningKeywords: ["global", "this", "window", "non-strict"],
    explanation: "In non-strict browser global code, this refers to window. In other environments it may be the global object."
  },
  {
    id: "m5-q2",
    topic: "this Binding",
    difficulty: "Medium",
    title: "Implicit binding",
    code: `const obj = {
  a: 10,
  fn() {
    console.log(this.a);
  }
};

obj.fn();`,
    expectedOutput: ["10"],
    reasoningKeywords: ["this", "implicit", "call site", "obj"],
    explanation: "obj.fn() uses implicit binding, so this points to obj."
  },
  {
    id: "m5-q3",
    topic: "this Binding",
    difficulty: "Medium",
    title: "Lost method context",
    code: `const obj = {
  a: 10,
  fn() {
    console.log(this.a);
  }
};

const fn = obj.fn;
fn();`,
    expectedOutput: ["undefined"],
    reasoningKeywords: ["lost context", "default binding", "call site", "this"],
    explanation: "The function is called without obj as the receiver, so the original method context is lost."
  },
  {
    id: "m5-q4",
    topic: "this Binding",
    difficulty: "Hard",
    title: "Timer callback loses this",
    code: `const obj = {
  a: 10,
  fn() {
    setTimeout(function () {
      console.log(this.a);
    }, 0);
  }
};

obj.fn();`,
    expectedOutput: ["undefined"],
    reasoningKeywords: ["callback", "this", "setTimeout", "lost"],
    explanation: "The regular function callback has its own this binding and does not keep obj as this."
  },
  {
    id: "m5-q5",
    topic: "this Binding",
    difficulty: "Hard",
    title: "Arrow callback keeps this",
    code: `const obj = {
  a: 10,
  fn() {
    setTimeout(() => console.log(this.a), 0);
  }
};

obj.fn();`,
    expectedOutput: ["10"],
    reasoningKeywords: ["arrow", "lexical this", "callback", "obj"],
    explanation: "The arrow callback captures this from fn, where this is obj."
  },
  {
    id: "m6-q1",
    topic: "Type Coercion & Equality",
    difficulty: "Easy",
    title: "String equals number",
    code: `console.log("5" == 5);`,
    expectedOutput: ["true"],
    reasoningKeywords: ["coercion", "string", "number", "loose equality"],
    explanation: "Loose equality converts the string to a number before comparison."
  },
  {
    id: "m6-q2",
    topic: "Type Coercion & Equality",
    difficulty: "Medium",
    title: "Boolean equals number",
    code: `console.log(false == 0);`,
    expectedOutput: ["true"],
    reasoningKeywords: ["boolean", "number", "coercion", "false"],
    explanation: "false is converted to 0 for loose equality."
  },
  {
    id: "m6-q3",
    topic: "Type Coercion & Equality",
    difficulty: "Medium",
    title: "Array equals empty string",
    code: `console.log([] == "");`,
    expectedOutput: ["true"],
    reasoningKeywords: ["array", "toString", "empty string", "coercion"],
    explanation: "[] converts to an empty string, so the loose comparison is true."
  },
  {
    id: "m6-q4",
    topic: "Type Coercion & Equality",
    difficulty: "Hard",
    title: "Array equals zero",
    code: `console.log([] == 0);`,
    expectedOutput: ["true"],
    reasoningKeywords: ["array", "empty string", "number", "coercion"],
    explanation: "[] becomes an empty string, then numeric comparison converts that to 0."
  },
  {
    id: "m6-q5",
    topic: "Type Coercion & Equality",
    difficulty: "Hard",
    title: "Object reference equality",
    code: `console.log({} == {});`,
    expectedOutput: ["false"],
    reasoningKeywords: ["object", "reference", "identity", "different"],
    explanation: "Objects compare by reference. These are two different object instances."
  },
  {
    id: "m7-q1",
    topic: "Truthy/Falsy & Logical Operators",
    difficulty: "Easy",
    title: "Truthy string",
    code: `if ("hello") console.log("yes");`,
    expectedOutput: ["yes"],
    reasoningKeywords: ["truthy", "string", "if"],
    explanation: "Non-empty strings are truthy, so the if body runs."
  },
  {
    id: "m7-q2",
    topic: "Truthy/Falsy & Logical Operators",
    difficulty: "Medium",
    title: "OR returns fallback",
    code: `console.log(0 || "fallback");`,
    expectedOutput: ["fallback"],
    reasoningKeywords: ["or", "falsy", "short-circuit", "operand"],
    explanation: "0 is falsy, so || evaluates and returns the second operand."
  },
  {
    id: "m7-q3",
    topic: "Truthy/Falsy & Logical Operators",
    difficulty: "Medium",
    title: "AND returns first falsy operand",
    code: `console.log("" && "hi");`,
    expectedOutput: [""],
    reasoningKeywords: ["and", "falsy", "empty string", "short-circuit"],
    explanation: "&& stops at the first falsy operand and returns it."
  },
  {
    id: "m7-q4",
    topic: "Truthy/Falsy & Logical Operators",
    difficulty: "Hard",
    title: "AND returns last truthy operand",
    code: `console.log([] && {});`,
    expectedOutput: ["{}"],
    reasoningKeywords: ["truthy", "and", "object", "operand"],
    explanation: "Both [] and {} are truthy, so && returns the last operand."
  },
  {
    id: "m7-q5",
    topic: "Truthy/Falsy & Logical Operators",
    difficulty: "Hard",
    title: "Double negation of array",
    code: `console.log(!![]);`,
    expectedOutput: ["true"],
    reasoningKeywords: ["truthy", "array", "double negation", "boolean"],
    explanation: "Arrays are objects, and objects are truthy. !! converts that truthiness to true."
  },
  {
    id: "m8-q1",
    topic: "Event Loop",
    difficulty: "Easy",
    title: "Simple sync event loop",
    code: `console.log("A");
console.log("B");`,
    expectedOutput: ["A", "B"],
    reasoningKeywords: ["synchronous", "stack", "top to bottom"],
    explanation: "Both logs are synchronous, so they run immediately in order."
  },
  {
    id: "m8-q2",
    topic: "Event Loop",
    difficulty: "Medium",
    title: "Timer after sync",
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");`,
    expectedOutput: ["A", "C", "B"],
    reasoningKeywords: ["setTimeout", "macrotask", "sync", "stack"],
    explanation: "The timer callback waits as a macrotask until synchronous code completes."
  },
  {
    id: "m8-q3",
    topic: "Event Loop",
    difficulty: "Hard",
    title: "Microtask before timer",
    code: `console.log("A");
Promise.resolve().then(() => console.log("B"));
setTimeout(() => console.log("C"), 0);
console.log("D");`,
    expectedOutput: ["A", "D", "B", "C"],
    reasoningKeywords: ["microtask", "macrotask", "promise", "timer"],
    explanation: "Synchronous logs run first. Promise microtasks drain before timer macrotasks."
  },
  {
    id: "m8-q4",
    topic: "Event Loop",
    difficulty: "Hard",
    title: "Nested promise microtask",
    code: `Promise.resolve().then(() => {
  console.log("A");
  Promise.resolve().then(() => console.log("B"));
});`,
    expectedOutput: ["A", "B"],
    reasoningKeywords: ["promise", "nested", "microtask", "queue"],
    explanation: "The first microtask logs A and queues another microtask, which runs before moving to macrotasks."
  },
  {
    id: "m9-q1",
    topic: "Promises & Async/Await",
    difficulty: "Easy",
    title: "Async returns a promise",
    code: `async function foo() {
  return 1;
}

foo().then(console.log);`,
    expectedOutput: ["1"],
    reasoningKeywords: ["async", "promise", "then", "return"],
    explanation: "async functions always return a promise. Returning 1 resolves that promise with 1."
  },
  {
    id: "m9-q2",
    topic: "Promises & Async/Await",
    difficulty: "Medium",
    title: "Await continuation",
    code: `async function foo() {
  await 1;
  console.log("done");
}

foo();`,
    expectedOutput: ["done"],
    reasoningKeywords: ["await", "microtask", "continuation", "async"],
    explanation: "await schedules the rest of the async function as a microtask. With no other logs, done is the only output."
  },
  {
    id: "m9-q3",
    topic: "Promises & Async/Await",
    difficulty: "Hard",
    title: "Async interleaving",
    code: `async function foo() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}

console.log(3);
foo();`,
    expectedOutput: ["3", "1", "2"],
    reasoningKeywords: ["async", "await", "microtask", "sync"],
    explanation: "3 logs first. foo logs 1 synchronously, then await resumes the final log in a microtask."
  },
  {
    id: "m10-q1",
    topic: "Objects, Prototypes & Inheritance",
    difficulty: "Easy",
    title: "Object inherits toString",
    code: `const obj = {};
console.log(obj.toString !== undefined);`,
    expectedOutput: ["true"],
    reasoningKeywords: ["prototype", "object", "toString", "lookup"],
    explanation: "obj does not define toString directly, but finds it on Object.prototype."
  },
  {
    id: "m10-q2",
    topic: "Objects, Prototypes & Inheritance",
    difficulty: "Medium",
    title: "Constructor prototype lookup",
    code: `function A() {}
A.prototype.x = 10;

const a = new A();
console.log(a.x);`,
    expectedOutput: ["10"],
    reasoningKeywords: ["prototype", "new", "lookup", "constructor"],
    explanation: "new A creates an object linked to A.prototype, so x is found through the prototype chain."
  },
  {
    id: "m10-q3",
    topic: "Objects, Prototypes & Inheritance",
    difficulty: "Hard",
    title: "Inherited property is not own",
    code: `function A() {}
A.prototype.x = 10;

const a = new A();
console.log(a.hasOwnProperty("x"));`,
    expectedOutput: ["false"],
    reasoningKeywords: ["hasOwnProperty", "prototype", "own", "inherited"],
    explanation: "x lives on A.prototype, not directly on a, so hasOwnProperty returns false."
  },
  {
    id: "m11-q1",
    topic: "Memory & Garbage Collection",
    difficulty: "Hard",
    title: "Closure retains memory",
    code: `function leak() {
  let big = new Array(100000);
  return () => big.length;
}`,
    expectedOutput: ["Memory retained"],
    reasoningKeywords: ["closure", "reachable", "garbage collection", "memory"],
    explanation: "The returned function closes over big, keeping the array reachable and therefore retained in memory."
  },
  {
    id: "m12-q1",
    topic: "Common Edge Cases",
    difficulty: "Easy",
    title: "typeof null",
    code: `console.log(typeof null);`,
    expectedOutput: ["object"],
    reasoningKeywords: ["typeof", "null", "object", "historical"],
    explanation: "typeof null returns object due to a long-standing historical JavaScript quirk."
  },
  {
    id: "m12-q2",
    topic: "Common Edge Cases",
    difficulty: "Medium",
    title: "NaN strict equality",
    code: `console.log(NaN === NaN);`,
    expectedOutput: ["false"],
    reasoningKeywords: ["nan", "strict equality", "false", "not equal"],
    explanation: "NaN is the only JavaScript value that is not equal to itself with ===."
  },
  {
    id: "m12-q3",
    topic: "Common Edge Cases",
    difficulty: "Medium",
    title: "Object.is with NaN",
    code: `console.log(Object.is(NaN, NaN));`,
    expectedOutput: ["true"],
    reasoningKeywords: ["object.is", "nan", "samevalue", "true"],
    explanation: "Object.is uses SameValue semantics, where NaN is considered the same as NaN."
  }
];
