// Manual mock for react-native-mmkv in Jest test environment
// This avoids "NativeModule not linked" errors since MMKV requires native code.

const store = new Map<string, string>();

export class MMKV {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: { id?: string; encryptionKey?: string }) {}

  set(key: string, value: string): void {
    store.set(key, value);
  }

  getString(key: string): string | undefined {
    return store.get(key);
  }

  delete(key: string): void {
    store.delete(key);
  }

  clearAll(): void {
    store.clear();
  }
}
