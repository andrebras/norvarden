// Reports uncaught JavaScript errors to AppSignal. Bundled into dist/monitoring.js by scripts/build.mjs.
import Appsignal from '@appsignal/javascript';
import { plugin } from '@appsignal/plugin-window-events';

// Only the live site reports, so local development and previews stay quiet.
if (window.location.hostname === 'www.norvarden.com') {
  const appsignal = new Appsignal({
    key: 'e1089021-92df-4f13-8dd6-f84ecf6652ac', // front-end key, public by design
    revision: __REVISION__,
  });
  appsignal.use(plugin());
}
