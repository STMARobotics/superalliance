import GetTeamData from "./GetTeamData";
import GetConfigData from "./GetConfigData"

export async function getTeamsAndNames() {
    return (await GetTeamData.getTeamsAdvancedFromAPI())
}

export async function getTeamAvatars() {
    return (await GetTeamData.getAllTeamAvatars())
}

export async function getUserData(token: any) {
    return (await GetConfigData.getUsersFromAPI(token))
}

export async function getEventLockData(token: any) {
    return (await GetConfigData.getEventLockFromAPI(token))
}

export async function checkToken(token: any) {
    return (await GetConfigData.checkTokenFromAPI(token))
}