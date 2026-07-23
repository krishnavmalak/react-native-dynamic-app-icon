import { BrandConfig, AssetDownloadResult } from './types';
import { Storage } from './Storage';

export class AppIconManager {
  private static currentBrand: BrandConfig | null = null;
  private static readonly STORAGE_KEY = '@active_brand_config';

  static async setBrand(_brandId: string, config: BrandConfig): Promise<void> {
    this.currentBrand = config;
    await Storage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }

  static async fetchRemoteBrand(
    url: string,
    headers?: Record<string, string>
  ): Promise<BrandConfig> {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const config: BrandConfig = await response.json();
      return config;
    } catch (error) {
      console.error('[AppIconManager] Failed to fetch remote config:', error);
      throw error;
    }
  }

  static async restoreBrand(): Promise<void> {
    const saved = await Storage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.currentBrand = JSON.parse(saved);
      } catch {
        console.warn('[AppIconManager] Stored brand config was corrupt — clearing.');
        await Storage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  static getBrand(): BrandConfig | null {
    return this.currentBrand;
  }

  static async resetBrand(): Promise<void> {
    this.currentBrand = null;
    await Storage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Downloads remote asset URLs to the app's cache directory.
   */
  static async downloadAssets(urls: string[]): Promise<AssetDownloadResult[]> {
    return Promise.all(
      urls.map(async (url): Promise<AssetDownloadResult> => {
        try {
          const api = tryGetExpoFileSystem();
          if (api) {
            const { File, Paths, Directory } = api;
            const cacheDir = new Directory(Paths.cache, 'dynamic-app-icon');
            const downloaded = await File.downloadFileAsync(url, cacheDir, {
              idempotent: true,
            });
            return { success: true, filePath: downloaded.uri };
          }

          // Fallback: validate reachability via fetch (no persistence)
          const res = await fetch(url);
          if (!res.ok) {
            return { success: false, error: `HTTP ${res.status} fetching ${url}` };
          }
          return { success: true, filePath: url };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.warn(`[AppIconManager] Failed to download asset: ${url}`, message);
          return { success: false, error: message };
        }
      })
    );
  }

  static async prefetchAssets(urls: string[]): Promise<void> {
    const results = await this.downloadAssets(urls);
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      console.warn(
        `[AppIconManager] ${failed.length}/${urls.length} assets failed to prefetch.`,
        failed.map((r) => r.error)
      );
    }
  }
}

export const BrandManager = AppIconManager;

function tryGetExpoFileSystem(): {
  File: {
    downloadFileAsync: (
      url: string,
      destination: { [key: string]: unknown },
      options?: { idempotent?: boolean }
    ) => Promise<{ uri: string }>;
  };
  Paths: { cache: string };
  Directory: new (base: string, name: string) => { [key: string]: unknown };
} | null {
  try {
    const { File, Paths, Directory } = require('expo-file-system') as {
      File: {
        downloadFileAsync: (
          url: string,
          destination: { [key: string]: unknown },
          options?: { idempotent?: boolean }
        ) => Promise<{ uri: string }>;
      };
      Paths: { cache: string };
      Directory: new (base: string, name: string) => { [key: string]: unknown };
    };
    const _ = Paths.cache;
    void _;
    return { File, Paths, Directory };
  } catch {
    return null;
  }
}
