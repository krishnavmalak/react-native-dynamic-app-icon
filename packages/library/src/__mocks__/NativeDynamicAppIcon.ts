// Auto-mock for NativeDynamicAppIcon TurboModule in Jest.
import { Spec } from '../NativeDynamicAppIcon';

const NativeDynamicAppIcon: Spec = {
  changeIcon: jest.fn().mockResolvedValue(true),
  restoreDefaultIcon: jest.fn().mockResolvedValue(true),
  getCurrentIcon: jest.fn().mockResolvedValue('Default'),
  showSplash: jest.fn().mockResolvedValue(undefined),
  hideSplash: jest.fn().mockResolvedValue(undefined),
};

export default NativeDynamicAppIcon;
