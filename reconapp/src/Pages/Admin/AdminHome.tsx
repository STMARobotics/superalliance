import { useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Text, useMantineTheme } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"
import { AdministrationNavbar } from "../Components/AdministrationNavbar"

function AdminHome() {

    const auth = useAuthUser()
    const theme = useMantineTheme()

    return (
        <>
            {auth()?.user == "7028Admin" ? <>
                <div className="AdministrationContainer">

                    <UpdatedHeader />

                    <div className="AdministrationHomeSection">

                        <AdministrationNavbar
                        page="Home" />

                        <div className="AdministrationHomeContent">
                            <Text
                                className="SubmissionsFormDataTeamText"
                                color={theme.primaryColor}
                                ta="center"
                                fz="xl"
                                fw={700}
                            >
                                Administration
                            </Text>

                            <div className="AdminStatsContent">
                                This is where all the admin stats content will be!
                            </div>
                        </div>
                    </div>
                </div>
            </> : <>
                <AccessDenied />
            </>}
        </>
    )
}

export default AdminHome