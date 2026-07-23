// Manual mock for react-native-mmkv in Jest test environment
// Manual mock for @react-native-async-storage/async-storage in Jest test environment
const mockStorage = new Map<string, string>();

export default {
  setItem: jest.fn((key, value) => {
    mockStorage.set(key, value);
    return Promise.resolve();
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(mockStorage.get(key) ?? null);
  }),
  removeItem: jest.fn((key) => {
    mockStorage.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    mockStorage.clear();
    return Promise.resolve();
  }),
};
