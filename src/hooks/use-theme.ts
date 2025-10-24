import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    setTheme(newTheme);
  };

  const shouldUseDarkTheme = (): boolean => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }

    const hour = new Date().getHours();
    return hour >= 21 || hour < 6;
  };

  useEffect(() => {
    const updateTheme = () => {
      const darkTheme = shouldUseDarkTheme();
      applyTheme(darkTheme ? 'dark' : 'light');
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleChange);

    const interval = setInterval(updateTheme, 60000);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(interval);
    };
  }, []);

  return { theme };
};
