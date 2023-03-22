import { MantineProvider, ColorSchemeProvider, ColorScheme, Group, Text, Anchor } from '@mantine/core';
import AppRouter from "./Pages/AppRouter";
import { AuthProvider } from 'react-auth-kit'
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { getTeamAvatars, getTeamsAndNames } from './Pages/Utils/ReconQueries';
import { NavigationProgress } from '@mantine/nprogress';
import { useState } from 'react';
import QuickAccess from './Pages/Modules/QuickAccess';
import QuickTeamSearch from './Pages/Modules/QuickTeamSearch';
import QuickInspector from './Pages/Modules/QuickInspector';

function ReconApp() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: false,
  });

  const [quickAccessEnabled, setQuickAccessEnabled] = useState(false)
  const [quickTeamSearchEnabled, setQuickTeamSearchEnabled] = useState(false)
  const [quickInspectorEnabled, setQuickInspectorEnabled] = useState(false)

  const [preferenceData, setPreferenceData] = useLocalStorage<any>({
    key: 'saved-preferences',
    defaultValue: {
      primaryColor: 'blue',
      dataShow: "all",
      landingComplete: false
    },
    getInitialValueInEffect: true,
  });

  (async function () {
    try {
      const response = await getTeamsAndNames()
      if (!window.localStorage.getItem('teamNames')) {
        const data = response.data
        localStorage.setItem('teamNames', JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
      } if (window.localStorage.getItem('teamNames')) {
        try {
          // @ts-ignore
          const parsedData = JSON.parse(window.localStorage.getItem('teamNames'))
          if (parsedData !== response.data) {
            localStorage.setItem('teamNames', JSON.stringify(response.data));
            window.dispatchEvent(new Event("storage"));
          }
        } catch {

        }
      }
    } catch (err) {
    }
  })();

  (async function () {
    try {
      const response = await getTeamAvatars()
      if (!window.localStorage.getItem('teamAvatars')) {
        const data = response.data
        localStorage.setItem('teamAvatars', JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
      } if (window.localStorage.getItem('teamAvatars')) {
        try {
          // @ts-ignore
          const parsedData = JSON.parse(window.localStorage.getItem('teamAvatars'))
          if (parsedData !== response.data) {
            localStorage.setItem('teamAvatars', JSON.stringify(response.data));
            window.dispatchEvent(new Event("storage"));
          }
        } catch {

        }
      }
    } catch (err) {
    }
  })();

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const toggleQuickAccessEnabled = (value?: boolean) =>
    setQuickAccessEnabled(value || (quickAccessEnabled ? false : true));

  const toggleQuickTeamSearchEnabled = (value?: boolean) =>
    setQuickTeamSearchEnabled(value || (quickTeamSearchEnabled ? false : true));

  const toggleQuickInspectorEnabled = (value?: boolean) =>
    setQuickInspectorEnabled(value || (quickInspectorEnabled ? false : true));

  useHotkeys([
    ['mod+shift+J', () => toggleColorScheme()],
    ['mod+q', () => toggleQuickAccessEnabled()],
    ['alt+shift+t', () => toggleQuickTeamSearchEnabled()],
    ['alt+shift+q', () => toggleQuickInspectorEnabled()],
  ]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider inherit theme={{ colorScheme, primaryColor: preferenceData.primaryColor }} withGlobalStyles withNormalizeCSS>
        <AuthProvider authType={'cookie'}
          authName={'_auth'}
          cookieDomain={window.location.hostname}
          cookieSecure={window.location.protocol === "https:"}>
          <NavigationProgress
            color={preferenceData.primaryColor}
            autoReset />
          <NotificationsProvider>
            <QuickAccess
              enabled={quickAccessEnabled}
              toggleEnabled={toggleQuickAccessEnabled} />
            <QuickTeamSearch
              enabled={quickTeamSearchEnabled}
              toggleEnabled={toggleQuickTeamSearchEnabled} />
            <QuickInspector
              enabled={quickInspectorEnabled}
              toggleEnabled={toggleQuickInspectorEnabled} />
            <AppRouter />
          </NotificationsProvider>
        </AuthProvider>
      </MantineProvider>
    </ColorSchemeProvider >
  );
}

export default ReconApp;
