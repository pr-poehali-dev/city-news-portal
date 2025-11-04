import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type City = 'Краснодар' | 'Москва';

interface CityContextType {
  city: City;
  setCity: (city: City) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City>(() => {
    const saved = localStorage.getItem('selectedCity');
    return (saved === 'Москва' ? 'Москва' : 'Краснодар') as City;
  });

  const setCity = (newCity: City) => {
    setCityState(newCity);
    localStorage.setItem('selectedCity', newCity);
  };

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
