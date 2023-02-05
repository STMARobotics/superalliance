import { AggregationsNavbar } from "../Components/AggregationsNavbar"
import { UpdatedHeader } from "../Components/UpdatedHeader"
import { Text } from '@mantine/core'

function AnalyzedFiltering() {
    return (
        <div className="SubmissionsContainer">
            <UpdatedHeader />
            <div className="SubmissionsHomeSection">
                <AggregationsNavbar
                    location={"Filtering"} />
                <div className="AnalyzedAveragesHome">
                    <Text
                        className="SubmissionsEventMatchesText"
                        color="#0066b3"
                        ta="center"
                        fz="xl"
                        fw={700}
                    >
                        Filtering
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default AnalyzedFiltering