import { useAuthHeader, useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Avatar, Button, Flex, Group, MultiSelect, Paper, Select, Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"
import { config } from "../../Constants"
import { useEffect, useState } from "react"
import { checkToken, getUserData } from "../Utils/ReconQueries"
import axios from "axios"

function AdminAuthentication() {

    const auth = useAuthUser()
    const theme = useMantineTheme()
    const authHeader = useAuthHeader()
    const token = authHeader()

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false)

    const adminAvatars = [
        "https://avatars.githubusercontent.com/u/74215559?v=4",
        "https://ca.slack-edge.com/T7C7Y7ZT5-U8SLAD76V-316d16704f58-72",
        "https://ca.slack-edge.com/T7C7Y7ZT5-UR2GS83AP-e91bae2d9356-72"
    ]

    useEffect(() => {
        (async function () {
            const d = await getUserData(token)
            setData(d.data.users[0])
        })()
    }, [])

    const updateUsers = (newData: any) => {
        (async function () {
            setLoading(true)
            await axios.post(
                config.api_url + "/api/v1/admin/users/save",
                {
                    token: token,
                    users: [
                        newData
                    ]
                }
            ).then(() => {
                setLoading(false)
            })
        })()
    }

    return (
        <>
            {auth()?.user == "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                            page="Authentication" />

                        <div className="AdministrationHomeContent">
                            <Flex justify={'center'} align={'center'} direction={'column'} gap={'25px'}>
                                <Text
                                    className="SubmissionsFormDataTeamText"
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                >
                                    Authentication
                                </Text>

                                <Text
                                    color={theme.colors[theme.primaryColor][2]}
                                    ta="center"
                                    size={30}
                                    fw={500}
                                >
                                    Regular Users
                                </Text>

                                <MultiSelect
                                    label="Add/Remove Users"
                                    data={data}
                                    placeholder="Select items"
                                    value={data}
                                    searchable
                                    creatable
                                    getCreateLabel={(query) => `Add - ${query}`}
                                    onCreate={(query) => {
                                        const item = { value: query, label: query };
                                        setData((current: any) => [...current, item]);
                                        return item;
                                    }}
                                    onChange={(event) => { setData(event) }}
                                />

                                <Button loading={loading} onClick={() => { updateUsers(data) }}>
                                    Save Users
                                </Button>

                                <Text
                                    color={theme.colors[theme.primaryColor][2]}
                                    ta="center"
                                    size={30}
                                    fw={500}
                                >
                                    Admin Users (View Only)
                                </Text>

                                <Group>
                                    {config.adminUsers.map((user: any, index: any) =>
                                        <Paper radius="md" shadow="md" p="md">
                                            <Group>
                                                <Avatar radius={'xl'} src={adminAvatars[index]}></Avatar>
                                                <Text>{user}</Text>
                                            </Group>
                                        </Paper>
                                    )}
                                </Group>
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

export default AdminAuthentication