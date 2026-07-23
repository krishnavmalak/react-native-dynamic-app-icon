export interface AppIconConfig {
  iconName: string;
}

export interface SplashConfig {
  logo?: string;
  background?: string;
  title?: string;
  subtitle?: string;
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  gradient?: string[];
  darkMode?: boolean;
}

export interface BrandTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface BrandConfig {
  id: string;
  appName: string;
  theme: BrandTheme;
  logoUrl?: string;
  iconName?: string;
}

export interface AssetDownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}
