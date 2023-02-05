import { useAuthUser } from "react-auth-kit"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Text } from '@mantine/core'
import { AccessDenied } from "../Components/AccessDenied"

function AdminPage() {

    const auth = useAuthUser()

    return (
        <>
            {auth()?.user == "Admin" ? <>
                <div className="App">

                    <UpdatedHeader />

                    <div className="App-main">

                        <div className="HomePageContainer">
                            <Text
                                className="SubmissionsFormDataTeamText"
                                color={"#0066b3"}
                                ta="center"
                                fz="xl"
                                fw={700}
                            >
                                Administration Homepage
                            </Text>
                        </div>
                    </div>
                </div>
            </> : <>
                <AccessDenied />
            </>}
        </>
    )
}

export default AdminPage