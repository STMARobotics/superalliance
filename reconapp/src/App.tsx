import { MantineProvider, ColorSchemeProvider, ColorScheme, Group, Text, Anchor } from '@mantine/core';
import AppRouter from "./Pages/AppRouter";
import { AuthProvider } from 'react-auth-kit'
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { getTeamAvatars, getTeamsAndNames } from './Pages/Utils/ReconQueries';
import { registerSpotlightActions, removeSpotlightActions, SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import { IconGraph, IconFileText, IconHome, IconForms, IconAnalyze, IconChartBar, IconCalendar, IconNumber, IconSearch } from '@tabler/icons';
import GetTeamData from './Pages/Utils/GetTeamData';
import { NavigationProgress } from '@mantine/nprogress';

function ReconApp() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: false,
  });

  const [preferenceData, setPreferenceData] = useLocalStorage<any>({
    key: 'saved-preferences',
    defaultValue: {
      primaryColor: 'blue',
      dataShow: "all",
      landingComplete: false
    },
    getInitialValueInEffect: true,
  });

  const actions: SpotlightAction[] = [
    {
      title: 'Home',
      description: 'Get to home page',
      onTrigger: () => window.location.href = '/',
      icon: <IconHome size={18} />,
      group: 'main'
    },
    {
      title: 'New Form',
      description: 'Submit a new recon form',
      onTrigger: () => window.location.href = '/newform',
      icon: <IconForms size={18} />,
      group: 'main'
    },
    {
      title: 'Submissions',
      description: 'View all form submissions',
      onTrigger: () => window.location.href = '/submissions',
      icon: <IconGraph size={18} />,
      group: 'main'
    },
    {
      title: 'Analytics',
      description: 'View all event form submissions',
      onTrigger: () => window.location.href = '/submissions/analysis',
      icon: <IconAnalyze size={18} />,
      group: 'main'
    },
    {
      title: 'Teams',
      description: 'View all team form submissions',
      onTrigger: () => window.location.href = '/submissions/teams',
      icon: <IconGraph size={18} />,
      group: 'Submissions'
    },
    {
      title: 'Events',
      description: 'View all event form submissions',
      onTrigger: () => window.location.href = '/submissions/events',
      icon: <IconCalendar size={18} />,
      group: 'Submissions'
    },
    {
      title: 'Averages',
      description: 'View all event form submissions',
      onTrigger: () => window.location.href = '/submissions/analysis/averages',
      icon: <IconChartBar size={18} />,
      group: 'analytics'
    },
    {
      title: 'Sorting',
      description: 'View all event form submissions',
      onTrigger: () => window.location.href = '/submissions/analysis/sorting',
      icon: <IconForms size={18} />,
      group: 'analytics'
    },
  ];

  function ActionsWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div>
        {children}
        <Group
          position="apart"
          px={15}
          py="xs"
          sx={(theme) => ({
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
          })}
        >
          <Text size="xs" color="dimmed">
            Powered by the Binary Battalion
          </Text>
          <Anchor size="xs" href="https://7028robotics.com" target={"_blank"}>
            Learn more
          </Anchor>
        </Group>
      </div>
    );
  }

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

  useHotkeys([['mod+shift+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, primaryColor: preferenceData.primaryColor }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <AuthProvider authType={'cookie'}
            authName={'_auth'}
            cookieDomain={window.location.hostname}
            cookieSecure={window.location.protocol === "https:"}>
            <SpotlightProvider
              shortcut={['mod + shift + P', 'mod + K', '/']}
              highlightQuery
              actions={actions}
              radius={"md"}
              overlayBlur={5}
              highlightColor={"blue"}
              searchIcon={<IconSearch />}
              overlayColor={"black"}
              searchPlaceholder={"Search something..."}
              nothingFoundMessage="Nothing found..."
              limit={4}
              transition="pop"
              transitionDuration={60}
              actionsWrapperComponent={ActionsWrapper}>
              <NavigationProgress
                color={preferenceData.primaryColor}
                autoReset />
              <AppRouter />
            </SpotlightProvider>
          </AuthProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider >
  );
}

export default ReconApp;
