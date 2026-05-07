# JavaScript Visualizer

An interactive web-based tool for visualizing JavaScript code execution, helping developers understand how JavaScript runs under the hood. Visualize the call stack, event loop, execution context, heap memory, and more in real-time.

## Features

- **Code Editor**: Write and edit JavaScript code with Monaco Editor
- **Runtime Visualization**: Step through code execution with visual representations of:
  - Call Stack
  - Event Loop
  - Execution Context
  - Heap Memory
  - Queue (Task/Microtask)
  - Web APIs
- **Playback Controls**: Play, pause, and control execution speed
- **Practice Mode**: Solve interactive challenges to test your understanding of JavaScript concepts
- **Theme Support**: Dark and light mode themes
- **Responsive Design**: Works seamlessly on different screen sizes

## Project Structure

```
src/
├── components/
│   ├── HeaderControls.jsx          # Navigation and theme toggle
│   ├── CodeEditorPanel.jsx         # Monaco editor integration
│   ├── RuntimeDashboard.jsx        # Main visualization dashboard
│   ├── BottomDock.jsx              # Bottom control panel
│   ├── visuals/
│   │   ├── CallStackPanel.jsx      # Call stack visualization
│   │   ├── EventLoopPanel.jsx      # Event loop visualization
│   │   ├── ExecutionContextPanel.jsx
│   │   ├── HeapPanel.jsx           # Memory heap visualization
│   │   ├── QueuePanel.jsx          # Task/microtask queue
│   │   ├── WebApisPanel.jsx        # Web APIs visualization
│   │   └── EmptyState.jsx
│   └── practice/
│       └── PracticePage.jsx        # Interactive practice challenges
├── engine/
│   ├── simulator.js                # Code execution simulator
│   ├── runtimeState.js             # Runtime state management
│   └── examples.js                 # Example code snippets
├── practice/
│   ├── practiceQuestions.js        # Practice challenge definitions
│   └── analyzeAnswer.js            # Answer analysis logic
├── store/
│   └── runtimeStore.js             # Zustand state management
└── App.jsx                         # Main app component
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor component
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Acorn** - JavaScript parser

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manishyadav361/javascript-visualizer.git
cd javascript-visualizer
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or your configured Vite port).

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm preview
```

## Usage

1. **Write Code**: Enter JavaScript code in the editor
2. **Execute**: Click the play button or use controls to step through execution
3. **Visualize**: Watch how JavaScript executes in real-time across different panels
4. **Practice**: Test your knowledge with interactive challenges in practice mode

## How It Works

The visualizer uses a JavaScript parser (Acorn) to analyze code and simulate its execution. It tracks:
- Variable scope and execution context
- Function call stack
- Memory allocation and objects
- Asynchronous operations and the event loop
- Browser APIs (setTimeout, fetch, etc.)

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

MIT