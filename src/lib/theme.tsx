import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void; }
const Ctx = createContext<ThemeCtx>({ theme: "light", toggle: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("kn-theme")) as Theme | null;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("kn-theme", theme); } catch {}
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark"), setTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
