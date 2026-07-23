let storageAvailable = false;
let storageResolved = false;

function getStorage() {
  if (storageResolved) {
    return storageAvailable ? require('@react-native-async-storage/async-storage').default : null;
  }

  storageResolved = true;
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    if (AsyncStorage) {
      storageAvailable = true;
      return AsyncStorage;
    }
  } catch {
    storageAvailable = false;
    console.warn(
      '[DynamicAppIcon] @react-native-async-storage/async-storage is not available. ' +
        'State will use an in-memory fallback for this session.'
    );
  }
  return null;
}

// In-memory fallback used when AsyncStorage is unavailable
const memoryFallback = new Map<string, string>();

export class Storage {
  static async setItem(key: string, value: string): Promise<void> {
    const s = getStorage();
    if (s) {
      try {
        await s.setItem(key, value);
      } catch (e) {
        console.warn(`[DynamicAppIcon] Failed to set item in AsyncStorage: ${e}`);
      }
    } else {
      memoryFallback.set(key, value);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    const s = getStorage();
    if (s) {
      try {
        const value = await s.getItem(key);
        return value !== undefined ? value : null;
      } catch (e) {
        console.warn(`[DynamicAppIcon] Failed to get item from AsyncStorage: ${e}`);
        return null;
      }
    }
    return memoryFallback.get(key) ?? null;
  }

  static async removeItem(key: string): Promise<void> {
    const s = getStorage();
    if (s) {
      try {
        await s.removeItem(key);
      } catch (e) {
        console.warn(`[DynamicAppIcon] Failed to remove item from AsyncStorage: ${e}`);
      }
    } else {
      memoryFallback.delete(key);
    }
  }
}
