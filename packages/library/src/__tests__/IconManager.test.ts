import { IconManager } from '../IconManager';
import NativeDynamicAppIcon from '../NativeDynamicAppIcon';

// Mock the native module
jest.mock('../NativeDynamicAppIcon', () => ({
  changeIcon: jest.fn(),
  restoreDefaultIcon: jest.fn(),
  getCurrentIcon: jest.fn(),
}));

describe('IconManager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should call NativeDynamicAppIcon.changeIcon with the correct icon name', async () => {
    (NativeDynamicAppIcon.changeIcon as jest.Mock).mockResolvedValue(true);

    const iconName = 'someIcon';
    const result = await IconManager.changeIcon(iconName);

    expect(NativeDynamicAppIcon.changeIcon).toHaveBeenCalledTimes(1);
    expect(NativeDynamicAppIcon.changeIcon).toHaveBeenCalledWith(iconName);
    expect(result).toBe(true);
  });

  it('should call NativeDynamicAppIcon.restoreDefaultIcon', async () => {
    (NativeDynamicAppIcon.restoreDefaultIcon as jest.Mock).mockResolvedValue(true);

    const result = await IconManager.restoreDefaultIcon();

    expect(NativeDynamicAppIcon.restoreDefaultIcon).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should call NativeDynamicAppIcon.getCurrentIcon and return its value', async () => {
    const mockCurrentIcon = 'currentIcon';
    (NativeDynamicAppIcon.getCurrentIcon as jest.Mock).mockResolvedValue(mockCurrentIcon);

    const result = await IconManager.getCurrentIcon();

    expect(NativeDynamicAppIcon.getCurrentIcon).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockCurrentIcon);
  });

  it('should handle errors from NativeDynamicAppIcon.changeIcon', async () => {
    const errorMessage = 'Failed to change icon';
    (NativeDynamicAppIcon.changeIcon as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(IconManager.changeIcon('errorIcon')).rejects.toThrow(errorMessage);
  });

  it('should handle errors from NativeDynamicAppIcon.restoreDefaultIcon', async () => {
    const errorMessage = 'Failed to restore default icon';
    (NativeDynamicAppIcon.restoreDefaultIcon as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(IconManager.restoreDefaultIcon()).rejects.toThrow(errorMessage);
  });

  it('should handle errors from NativeDynamicAppIcon.getCurrentIcon', async () => {
    const errorMessage = 'Failed to get current icon';
    (NativeDynamicAppIcon.getCurrentIcon as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(IconManager.getCurrentIcon()).rejects.toThrow(errorMessage);
  });
});
