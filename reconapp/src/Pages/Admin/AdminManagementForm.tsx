import { useAuthHeader, useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, createStyles, Flex, Grid, Menu, Modal, MultiSelect, Paper, Select, Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"
import { config } from "../../Constants"
import { useEffect, useState } from "react"
import { checkToken, getEventLockData, getUserData } from "../Utils/ReconQueries"
import axios from "axios"
import GetTeamData from "../Utils/GetTeamData"
import moment from "moment"
import { IconArrowsLeftRight, IconEdit, IconMessageCircle, IconNote, IconNumber, IconNumber0, IconPhoto, IconRobot, IconSearch, IconSettings, IconTable, IconTrash, IconUser } from "@tabler/icons"
import { QuickInfoCard } from "../Components/QuickInfoCard"
import { showNotification } from "@mantine/notifications"

interface SubmissionActionProps {
    formId: string;
    submissionNumber: number;
    author: string;
    time: string;
    link: string;
    teamNumber: number;
    win: boolean;
    rankPoints: number;
    matchNumber: number;
    eventName: string;
}

function AdminFormManagement() {

    const auth = useAuthUser()
    const theme = useMantineTheme()
    const authHeader = useAuthHeader()
    const token = authHeader()

    const [formData, setFormData] = useState<any>([])
    const [openedData, setOpenedData] = useState<any>([])
    const [eventData, setEventData] = useState<any>([])

    useEffect(() => {
        (async function () {
            const submissionData = await GetTeamData.getAllFormSorting()
            setFormData(submissionData.data)
        })()
    }, [])

    useEffect(() => {
        var openedArray: any[] = []
        formData.map((data: any, index: any) => {
            openedArray.push({
                id: data._id,
                opened: false
            })
        })
        setOpenedData(openedArray)
    }, [formData])

    useEffect(() => {
        (async function () {
            var eventArray: any[] = [];
            eventArray.push({
                label: "All Events",
                value: "all"
            })
            eventArray.push({
                label: "Testing Event",
                value: "testing",
                shortCode: "testing"
            })
            eventArray.push({
                label: "Week 0 Event",
                value: "week0",
                shortCode: "week0"
            })
            const eventdata = await GetTeamData.getTeamEventDataLanding(7028, 2023)
            eventdata.data.map((event: any) => {
                eventArray.push(event)
            })
            setEventData(eventArray)
        })()
    }, [])

    function UserInfoAction({ formId, matchNumber, author, link, teamNumber, win, rankPoints, eventName }: SubmissionActionProps) {

        const theme = useMantineTheme()

        const getEventCode = () => {
            try {
                if (eventName == 'Testing Event') return 'testing'
                if (eventName == 'Week 0 Event') return 'week0'
                const d = eventData.filter((e: any) => {
                    return e.value == eventName
                })[0]
                return d.eventcode
            } catch {
                return ""
            }
        }

        const deleteForm = (formId: any) => {
            (async function () {
                await axios.post(
                    config.api_url + "/api/v1/admin/form/delete",
                    {
                        token: token,
                        formId: formId
                    }
                ).catch(() => {
                    showNotification({
                        title: 'Error!',
                        message: 'There was an error while attempting to delete the form!',
                        color: "red",
                    })
                })
                showNotification({
                    title: 'Success!',
                    message: `Form ID: ${formId}, was deleted!`,
                    color: "green",
                })
                const submissionData = await GetTeamData.getAllFormSorting()
                setFormData(submissionData.data)
            })()
        }

        return (
            <Paper
                radius="md"
                className="SubmissionMatchBox"
                p="sm"
                sx={(theme) => ({
                    backgroundColor: win ? theme.colors.green : theme.colors.red,
                })}
            >

                <Modal
                    transition="fade"
                    transitionDuration={600}
                    transitionTimingFunction="ease"
                    zIndex={1500}
                    opened={openedData.filter((e: any) => {
                        return e.id == formId
                    })[0]?.opened}
                    onClose={() => {
                        var openArray: any[] = []
                        openedData.map((data: any) => {
                            if (data.id == formId) return openArray.push({ id: data.id, opened: false })
                            return openArray.push(data)
                        })
                        setOpenedData(openArray)
                    }}
                    overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                    overlayOpacity={0.55}
                    overlayBlur={3}
                    centered
                    title="Quick Info."
                >
                    <QuickInfoCard
                        title="Quick Info"
                        author={`${author}`}
                        formId={`${formId}`}
                        eventName={`${eventName}`}
                        stats={[
                            { title: 'Team #', value: `${teamNumber}` },
                            { title: 'Match #', value: `${matchNumber}` },
                            { title: 'RP Earned', value: `+${rankPoints}` },
                            { title: 'Win?', value: `${win}` }
                        ]}
                    />
                </Modal>

                <Text align="center" size="lg" weight={500} color="white">
                    Team #{teamNumber} - Match #{matchNumber}
                </Text>
                <Text align="center" size="xs" color="white">
                    {author} • +{rankPoints} RP
                </Text>

                <Menu shadow="md" width={200}>
                    <Button
                        color={win ? "green" : "red"}
                        variant="filled"
                        fullWidth
                        mt="md"
                        component="a"
                        href={link}
                    >
                        View Form
                    </Button>

                    <Menu.Target>
                        <Button
                            color={win ? "green" : "red"}
                            variant="filled"
                            fullWidth
                            mt="md"
                        >
                            Manage
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Quick Access</Menu.Label>
                        <Menu.Item onClick={() => {
                            var openArray: any[] = []
                            openedData.map((data: any) => {
                                if (data.id == formId) return openArray.push({ id: data.id, opened: true })
                                return openArray.push(data)
                            })
                            setOpenedData(openArray)
                        }} icon={<IconNote size={14} />}>Quick Info</Menu.Item>
                        <Menu.Item component="a" href={`/submissions/user/${(author).replace(" ", "+")}`} target={'_blank'} icon={<IconUser size={14} />}>View All From User</Menu.Item>
                        <Menu.Item component="a" href={`/submissions/event/${getEventCode()}/${matchNumber}`} target={'_blank'} icon={<IconNumber0 size={14} />}>View All From Match</Menu.Item>
                        <Menu.Item component="a" href={`/submissions/teams/${teamNumber}`} target={'_blank'} icon={<IconRobot size={14} />}>View All From Team</Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        <Menu.Item disabled color="yellow" icon={<IconEdit size={14} />}>Edit Form (Coming Soon)</Menu.Item>
                        <Menu.Item onClick={() => {
                            deleteForm(formId)
                        }} color="red" icon={<IconTrash size={14} />}>Delete Form</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Paper>
        );
    }

    return (
        <>
            {auth()?.user == "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                            page="Form Management" />

                        <div className="AdministrationHomeContent">
                            <Flex justify={'center'} align={'center'} direction={'column'} gap={'25px'}>
                                <Text
                                    className="SubmissionsFormDataTeamText"
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                >
                                    Form Management
                                </Text>

                                <Grid justify="center" grow w={"100%"}>
                                    {formData.map((data: any, index: any) =>
                                        <Grid.Col md={4} lg={3} key={index + 1}>
                                            <UserInfoAction
                                                formId={data._id}
                                                submissionNumber={index + 1}
                                                author={data.usersName}
                                                time={moment(data.createdAt).format("hh:mm A")}
                                                link={`/submissions/analysis/form/${data._id}`}
                                                teamNumber={data.teamNumber}
                                                win={data.win}
                                                rankPoints={data.rankPointsEarned}
                                                matchNumber={data.matchNumber}
                                                eventName={data.eventName}
                                            />
                                        </Grid.Col>
                                    )}
                                </Grid>

                            </Flex>
                        </div>
                    </div>
                </div>
            </> : <>
                <AccessDenied />
            </>}
        </>
    )
}

export default AdminFormManagement