import axios from 'axios'
import { config } from '../../Constants';

interface formData {
    data: {
        teamNumber: number,
        strategyOverall: string,
        strategyAprilTags: string,
        strategyLanguage: string,
        mechanicalProtectedElectronics: string,
        mechanicalSecuredBattery: string,
        mechanicalBatteryNum: number,
        mechanicalBatteryOldest: string,
        mechanicalBatteryChargeNum: number,
        mechanicalHaveCameras: boolean,
        mechanicalHaveAuto: boolean,
        mechanicalAutoInfo: string,
        mechanicalCubesLow: boolean,
        mechanicalCubesMid: boolean,
        mechanicalCubesHigh: boolean,
        mechanicalConesLow: boolean,
        mechanicalConesMid: boolean,
        mechanicalConesHigh: boolean,
        mechanicalAutoBalancingTools: string,
        mechanicalChargeStationInches: string,
        mechanicalFrameDimensions: string,
        mechanicalRobotIssues: string,
        generalStudentNum: number,
        generalMentorNum: number,
        generalRobotNum: number,
        generalCameraUsage: string,
        generalDriveTrain: string,
        generalDriveTrainBrand: string,
        generalSwerveYears: string,
        generalSwerveFixLoctite: boolean,
        generalSwerveFixShafts: boolean,
        driveteamRobotCompliments: string,
        driveteamChanges: string,
        driveteamSameTeamMatch: boolean,
        driveteamManipulationMech: string,
        driveteamStrongestValue: string,
        driveteamWeakestValue: string,
        driveteamExtraComments: string,
        driveteamDirectContact: string,
        robotImage: string,
    }
}

const PitSendToAPI = async (values: formData, token: string) => {

    const apiValues = {
        token: token,
        data: values,
    }

    await axios.post(
        config.api_url + "/api/v1/submitpitform",
        apiValues
    ).catch(() => {
        throw new Error("Form didn't submit.")
    })
};

export default PitSendToAPI