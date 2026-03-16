import { ConfigProvider, theme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => {
    // Check localStorage on initial load, default to light theme
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: dark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: "#00ff99", // matched with CSS variable
            borderRadius: 6,
            colorBgBase: dark ? "#141414" : "#ffffff",
            colorTextBase: dark ? "#ffffff" : "#141414",
          },
          components: {
            Layout: {
              headerBg: dark ? "#141414" : "#ffffff",
              siderBg: dark ? "#141414" : "#ffffff",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
