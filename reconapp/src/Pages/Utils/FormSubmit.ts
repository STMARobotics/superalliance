import axios from 'axios'
import config from '../../Constants'

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
        eventName: string
    }
}

const SendToAPI = async (values: formData, token: any) => {

    const apiValues = {
        token: token,
        data: values
    }

    try {
        const response = await axios.post(
            config.api_url + "/api/v1/submitform",
            apiValues
        );

    } catch (err) {

    }
};

function FormSubmit(data: formData, authToken: string) {

    SendToAPI(data, authToken)

}

export default FormSubmit