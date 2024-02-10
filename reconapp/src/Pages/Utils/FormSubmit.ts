import axios from 'axios'
import { config } from '../../Constants'

interface formData {
    data: {
        teamNumber: number,
        matchNumber: number,
        usersName: string,
        auto: boolean,
        autoScoreLevel: number,
        autoExtraPiece: {
            scored: {
                autoAmp: number | undefined,
                autoSpeaker: number | undefined,
            }
        }
        autoTaxi: boolean,
        teleop: {
            scored: {
                    speaker: number | undefined,
                    amp: number | undefined,
                    trap: number | undefined,
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
        pickUpFloorRings: number,
        humanPlayerStation: number,
    }
}

const SendToAPI = async (values: formData, token: string) => {

    const apiValues = {
        token: token,
        data: values
    }

    await axios.post(
        config.api_url + "/api/v1/submitform",
        apiValues
    ).catch(() => {
        throw new Error("Form didn't submit.")
    })

};

function FormSubmit(data: formData, authToken: string) {

    SendToAPI(data, authToken)

}

export default SendToAPI