import { useAuthHeader, useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Button, Flex, MultiSelect, Select, Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"
import { config } from "../../Constants"
import { useEffect, useState } from "react"
import { checkToken, getEventLockData, getUserData } from "../Utils/ReconQueries"
import axios from "axios"
import GetTeamData from "../Utils/GetTeamData"

function AdminUserLookup() {

    const auth = useAuthUser()
    const theme = useMantineTheme()
    const authHeader = useAuthHeader()
    const token = authHeader()

    const [data, setData] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        (async function () {
            const d = await getUserData(token)
            setData(d.data.users[0])
        })()
    }, [])

    return (
        <>
            {auth()?.user == "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                            page="User Lookup" />

                        <div className="AdministrationHomeContent">
                            <Flex justify={'center'} align={'center'} direction={'column'} gap={'25px'}>

                                <Text
                                    className="SubmissionsFormDataTeamText"
                                    color={theme.primaryColor}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                >
                                    User Lookup
                                </Text>

                                <Select
                                    transition={'pop-top-left'}
                                    transitionDuration={80}
                                    transitionTimingFunction={'ease'}
                                    dropdownPosition="bottom"
                                    style={{ zIndex: 2 }}
                                    data={data}
                                    placeholder="Pick one"
                                    label="User Name"
                                    searchable
                                    value={selectedUser}
                                    onChange={(event: string) => setSelectedUser(event)}
                                />

                                <Button component="a" href={`/submissions/user/${(selectedUser).replace(" ", "+")}`} target={'_blank'}>
                                    View Forms
                                </Button>
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

export default AdminUserLookup