import axios from 'axios'
import { config } from '../../Constants'

interface formData {
    data: {
        teamNumber: number,
        matchNumber: number,
        usersName: string,
        auto: boolean,
        autoEngaged: boolean,
        autoDocked: boolean,
        autoScoreLevel: number,
        autoExtraPiece: {
            scored: {
                high: number | undefined,
                mid: number | undefined,
                low: number | undefined,
            }
        }
        autoTaxi: boolean,
        teleop: {
            scored: {
                cube: {
                    high: number | undefined,
                    mid: number | undefined,
                    low: number | undefined,
                },
                cone: {
                    high: number | undefined,
                    mid: number | undefined,
                    low: number | undefined,
                }
            }
        },
        endgameEngaged: boolean,
        endgameDocked: boolean,
        comments: string,
        rankPostMatch: number,
        win: boolean,
        rankPointsEarned: number,
        penalties: string,
        defenceOrCycle: boolean,
        userRating: number | undefined,
        eventName: string,
        criticals: Array<any[]> | undefined,
        pickUpTippedCones: number,
        pickUpFloorCones: number,
        humanPlayerStation: number,
    }
}

const EditFromAPI = async (values: formData, token: string, submissionId: string | undefined) => {

    const apiValues = {
        token: token,
        data: values,
        submissionId: submissionId
    }

    await axios.post(
        config.api_url + "/api/v1/editform",
        apiValues
    ).catch(() => {
        throw new Error("Form didn't submit.")
    })

};

export default EditFromAPI