import { DynamicAppIcon, Branding } from '../DynamicAppIcon';
import { AppIconManager, BrandManager } from '../AppIconManager';
import { IconManager } from '../IconManager';

describe('@krishnavm/@krishnavm/react-native-dynamic-app-icon', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get the brand correctly using DynamicAppIcon', async () => {
    const mockBrand = {
      id: 'test-brand',
      appName: 'Test App',
      theme: {
        primaryColor: '#000',
        secondaryColor: '#111',
        backgroundColor: '#fff',
        textColor: '#222'
      }
    };

    await DynamicAppIcon.setBrand('test-brand', mockBrand);
    const retrievedBrand = DynamicAppIcon.getBrand();

    expect(retrievedBrand).toEqual(mockBrand);
  });

  it('should maintain backward compatibility with Branding alias', async () => {
    expect(Branding).toBe(DynamicAppIcon);
    expect(BrandManager).toBe(AppIconManager);
  });

  it('should reset the brand', async () => {
    await DynamicAppIcon.resetBrand();
    expect(DynamicAppIcon.getBrand()).toBeNull();
  });

  it('should call IconManager when changing icon', async () => {
    const iconSpy = jest.spyOn(IconManager, 'changeIcon').mockResolvedValue(true);
    const result = await DynamicAppIcon.changeIcon('new-icon');
    
    expect(iconSpy).toHaveBeenCalledWith('new-icon');
    expect(result).toBe(true);
  });

  it('should call IconManager when restoring default icon', async () => {
    const restoreSpy = jest.spyOn(IconManager, 'restoreDefaultIcon').mockResolvedValue(true);
    const result = await DynamicAppIcon.restoreDefaultIcon();
    
    expect(restoreSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should call IconManager when getting current icon', async () => {
    const getSpy = jest.spyOn(IconManager, 'getCurrentIcon').mockResolvedValue('orange');
    const result = await DynamicAppIcon.getCurrentIcon();
    
    expect(getSpy).toHaveBeenCalled();
    expect(result).toBe('orange');
  });

  it('should fall back to validating remote assets when expo-file-system is unavailable', async () => {
    const fetchSpy = jest
      .spyOn(globalThis as any, 'fetch')
      .mockImplementation(async () => ({ ok: true } as any));

    const results = await AppIconManager.downloadAssets(['https://example.com/logo.png']);

    expect(fetchSpy).toHaveBeenCalledWith('https://example.com/logo.png');
    expect(results).toEqual([
      {
        success: true,
        filePath: 'https://example.com/logo.png',
      },
    ]);
  });
});
