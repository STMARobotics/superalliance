import {
    createStyles,
    Card,
    Text,
    SimpleGrid,
    UnstyledButton,
    Anchor,
    Group,
    Modal,
    Input,
    TextInput,
    Button,
    Stack,
    Select,
} from '@mantine/core';
import {
    IconCreditCard,
    IconBuildingBank,
    IconRepeat,
    IconReceiptRefund,
    IconReceipt,
    IconReceiptTax,
    IconReport,
    IconCashBanknote,
    IconCoin,
    IconHome2,
    IconForms,
    IconArrowLeft,
    IconClipboard,
    IconStairs,
    IconFileSpreadsheet,
    IconNumber0,
    IconCircleNumber5,
    IconCircleNumber1,
    IconCalendar,
} from '@tabler/icons';
import { useEffect, useState } from "react";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import GetTeamData from '../Utils/GetTeamData';
import EventSelectStyles from '../Styles/EventSelectStyles';

interface ActionGridProps {
    mockdata: any[],
    modalContent?: any,
    modalVisible?: any
}

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: `90px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 100ms ease',

        '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'scale(1.05)',
        },
    },
}));

function ActionsGrid({ mockdata }: ActionGridProps) {
    const { classes, theme } = useStyles();

    const items = mockdata.map((item) => (
        <UnstyledButton key={item.title} className={classes.item} onClick={item.onClick}>
            <item.icon color={theme.colors[item.color][6]} size="2rem" />
            <Text size="xs" mt={7}>
                {item.title}
            </Text>
        </UnstyledButton>
    ));

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Group position="apart">
                <Text className={classes.title}>Quick Actions</Text>
            </Group>
            <SimpleGrid cols={3} mt="md">
                {items}
            </SimpleGrid>
        </Card>
    );
}

interface QuickAccessProps {
    enabled: boolean;
    toggleEnabled: any;
}

function QuickAccess({ enabled, toggleEnabled }: QuickAccessProps) {

    const [opened, { open, close }] = useDisclosure(false);
    const focusTrapRef = useFocusTrap();

    const eventSelectClasses = EventSelectStyles().classes

    const homeMockData = [
        { title: 'Home', icon: IconHome2, color: 'violet', onClick: () => { window.location.href = '/' } },
        {
            title: 'New Form', icon: IconForms, color: 'indigo', onClick: () => {
                setMockData([
                    { title: 'Back', icon: IconArrowLeft, color: 'violet', onClick: () => setMockData(homeMockData) },
                    { title: 'New Stand Form', icon: IconClipboard, color: 'indigo', onClick: () => window.location.href = '/newform' },
                    { title: 'New Pit Form', icon: IconFileSpreadsheet, color: 'blue', onClick: () => window.location.href = '/newpitform' },
                ])
            }
        },
        {
            title: 'Search Forms', icon: IconRepeat, color: 'blue', onClick: () => {
                setMockData([
                    { title: 'Back', icon: IconArrowLeft, color: 'violet', onClick: () => setMockData(homeMockData) },
                    {
                        title: 'Search by Team Number', icon: IconClipboard, color: 'indigo', onClick: () => {
                            setModalMode('searchbyteamnum')
                            open()
                        }
                    },
                    {
                        title: 'Search by Event', icon: IconFileSpreadsheet, color: 'blue', onClick: () => {
                            setModalMode('searchbyevent')
                            open()
                        }
                    },
                ])
            }
        },
        // { title: 'Refunds', icon: IconReceiptRefund, color: 'green', onClick: () => null },
        // { title: 'Receipts', icon: IconReceipt, color: 'teal', onClick: () => null },
        // { title: 'Taxes', icon: IconReceiptTax, color: 'cyan', onClick: () => null },
        // { title: 'Reports', icon: IconReport, color: 'pink', onClick: () => null },
        // { title: 'Payments', icon: IconCoin, color: 'red', onClick: () => null },
        // { title: 'Cashback', icon: IconCashBanknote, color: 'orange', onClick: () => null },
    ]

    const [mockData, setMockData] = useState<any>(homeMockData)
    const [modalMode, setModalMode] = useState('')

    const [searchbyteamnum, setSearchbyteamnum] = useState('')
    const [searchbyevent, setSearchbyevent] = useState('')

    const modeSwitch = () => {
        switch (modalMode) {
            case 'searchbyteamnum':
                return (
                    <Modal transition={'rotate-left'} centered zIndex={10001} opened={opened} onClose={close} title="Search by Team Number">
                        <Stack ref={focusTrapRef} spacing="lg">
                            <TextInput
                                data-autofocus
                                icon={<IconCircleNumber1 />}
                                placeholder="Team Number"
                                value={searchbyteamnum}
                                onChange={(event) => {
                                    setSearchbyteamnum(event.currentTarget.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.code !== 'Enter') return
                                    window.open(`/submissions/teams/${searchbyteamnum}`)
                                }}
                            />

                            <Button variant='outline' component='a' href={`/submissions/teams/${searchbyteamnum}`} target={'_blank'}>
                                View Forms
                            </Button>
                        </Stack>
                    </Modal>
                )
                break;
            case 'searchbyevent':
                return (
                    <Modal transition={'rotate-left'} centered zIndex={10001} opened={opened} onClose={close} title="Search by Team Number">
                        <Stack ref={focusTrapRef} spacing="lg">
                            <Select
                                transition={'pop-top-left'}
                                transitionDuration={80}
                                transitionTimingFunction={'ease'}
                                dropdownPosition="bottom"
                                style={{ zIndex: 10 }}
                                data={[
                                    { label: "Testing Event", value: "testing" },
                                    { label: "Week 0 Event", value: "week0" },
                                    { label: "Grand Forks", value: "ndgf" },
                                    { label: "La Crosse", value: "mnmi2" }
                                ]}
                                placeholder="Pick one"
                                label="Select Data To Show"
                                classNames={eventSelectClasses}
                                onChange={(event: string) => {
                                    window.open(`/submissions/event/${event}`)
                                }}
                            />
                        </Stack>
                    </Modal>
                )
                break;
        }
    }

    return (
        <>
            {modeSwitch()}
            <Modal transition={'skew-up'} zIndex={10000} opened={enabled} onClose={() => {
                setMockData(homeMockData)
                toggleEnabled()
            }}>
                <ActionsGrid
                    mockdata={mockData} />
            </Modal>
        </>
    )
}

export default QuickAccess