import { ConfigProvider, theme } from "antd";
import { createContext, useContext, useState } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: dark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: "#70A83E",
            borderRadius: 6,
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
