import { useEffect, useState } from "react";
import { useRuntimeStore } from "./store/runtimeStore";
import { HeaderControls } from "./components/HeaderControls";
import { CodeEditorPanel } from "./components/CodeEditorPanel";
import { RuntimeDashboard } from "./components/RuntimeDashboard";
import { BottomDock } from "./components/BottomDock";
import { PracticePage } from "./components/practice/PracticePage";

function usePlaybackClock() {
  const isPlaying = useRuntimeStore((state) => state.isPlaying);
  const speed = useRuntimeStore((state) => state.speed);
  const nextStep = useRuntimeStore((state) => state.nextStep);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(nextStep, speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, nextStep, speed]);
}

export default function App() {
  usePlaybackClock();
  const route = useRuntimeStore((state) => state.route);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  useEffect(() => {
    const onPopState = () => {
      useRuntimeStore.setState({ route: window.location.pathname === "/practice" ? "practice" : "visualizer" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <main className="flex h-screen min-h-0 flex-col bg-app-bg text-app-text">
      <HeaderControls isDark={theme === "dark"} toggleTheme={toggleTheme} />
      {route === "practice" ? (
        <PracticePage />
      ) : (
        <>
          <section className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-visible px-4 pb-20 pt-4 xl:grid-cols-[minmax(340px,0.82fr)_minmax(700px,1.58fr)]">
            <CodeEditorPanel theme={theme} />
            <RuntimeDashboard />
          </section>
          <BottomDock />
        </>
      )}
    </main>
  );
}
