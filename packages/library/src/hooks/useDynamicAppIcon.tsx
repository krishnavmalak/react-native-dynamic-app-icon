import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrandConfig } from '../types';
import { ThemeMode } from '../ThemeManager';
import { DynamicAppIcon } from '../DynamicAppIcon';

interface DynamicAppIconContextType {
  brand: BrandConfig | null;
  theme: ThemeMode;
  isInitialized: boolean;
  setTheme: (mode: ThemeMode) => Promise<void>;
  setBrand: (id: string, config: BrandConfig) => Promise<void>;
  resetBrand: () => Promise<void>;
  changeIcon: (iconName: string) => Promise<boolean>;
  restoreDefaultIcon: () => Promise<boolean>;
  getCurrentIcon: () => Promise<string>;
}

const DynamicAppIconContext = createContext<DynamicAppIconContextType | undefined>(undefined);

export const DynamicAppIconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrandState] = useState<BrandConfig | null>(null);
  const [theme, setThemeState] = useState<ThemeMode>('auto');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize: restore persisted brand + theme from MMKV storage
    DynamicAppIcon.initialize().then(() => {
      setBrandState(DynamicAppIcon.getBrand());
      setThemeState(DynamicAppIcon.getTheme());
      setIsInitialized(true);
    });
  }, []);

  const handleSetBrand = useCallback(async (id: string, config: BrandConfig) => {
    await DynamicAppIcon.setBrand(id, config);
    setBrandState(config);
  }, []);

  const handleSetTheme = useCallback(async (mode: ThemeMode) => {
    await DynamicAppIcon.setTheme(mode);
    setThemeState(mode);
  }, []);

  const handleResetBrand = useCallback(async () => {
    await DynamicAppIcon.resetBrand();
    setBrandState(null);
  }, []);

  return (
    <DynamicAppIconContext.Provider
      value={{
        brand,
        theme,
        isInitialized,
        setTheme: handleSetTheme,
        setBrand: handleSetBrand,
        resetBrand: handleResetBrand,
        changeIcon: DynamicAppIcon.changeIcon,
        restoreDefaultIcon: DynamicAppIcon.restoreDefaultIcon,
        getCurrentIcon: DynamicAppIcon.getCurrentIcon,
      }}
    >
      {children}
    </DynamicAppIconContext.Provider>
  );
};

export const useDynamicAppIcon = (): DynamicAppIconContextType => {
  const context = useContext(DynamicAppIconContext);
  if (!context) {
    throw new Error('useDynamicAppIcon must be used within a DynamicAppIconProvider');
  }
  return context;
};

// Backward compatibility aliases
export const BrandProvider = DynamicAppIconProvider;
export const useBranding = useDynamicAppIcon;
