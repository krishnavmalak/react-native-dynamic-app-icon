import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withDynamicIconAndroid } from './withDynamicIconAndroid';
import { withDynamicIconIOS } from './withDynamicIconIOS';

interface Props {
  icons: string[];
}

export const withDynamicAppIcon: ConfigPlugin<Props> = (config, props) => {
  return withPlugins(config, [
    [withDynamicIconAndroid, props],
    [withDynamicIconIOS, props],
  ]);
};

export const withDynamicBranding = withDynamicAppIcon;
export default withDynamicAppIcon;
