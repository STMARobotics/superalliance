import GetTeamData from "./GetTeamData";

export async function getTeamsAndNames() {
    return (await GetTeamData.getTeamsAdvancedFromAPI())
}

export async function getTeamAvatars() {
    return (await GetTeamData.getAllTeamAvatars())
}