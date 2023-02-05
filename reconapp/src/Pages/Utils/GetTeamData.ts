import axios from "axios";
import config from "../../Constants";

const getTeamsFromAPI = async () => {
    const response = await axios.get(config.api_url + "/api/v1/teams");
    return response
}

const getTeamNicknameFromAPI = async (teamNumber: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/team/${teamNumber}/nickname`)
    return response
}

const getTeamSubmissions = async (teamNumber: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/team/${teamNumber}/submissions`);
    return response
}

const getFormSubmissionData = async (teamNumber: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/team/${teamNumber}/submissiondata`);
    return response
}

const getTeamEventData = async (teamNumber: Number, year: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/events/${teamNumber}/${year}`);
    return response
}

const getEventData = async (year:Number, eventId: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/event/${year}/${eventId}`)
    return response
}

const getAllFormData = async () => {
    const response = await axios.get(config.api_url + "/api/v1/submissions")
    return response
}

const getEventMatchData = async (eventId: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/eventmatches/${eventId}`)
    return response
}

const getMatchData = async (eventId: String | undefined, matchId: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/eventmatch/${eventId}/${matchId}`)
    return response
}

const getMatchSubmissionData = async (eventId: String | undefined, matchId: String | undefined, submissionId: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/eventmatch/${eventId}/${matchId}/${submissionId}`)
    return response
}

const getAggregationData = async () => {
    const response = await axios.get(config.api_url + `/api/v1/aggregation/data`)
    return response
}

const getAllFormSorting = async () => {
    const response = await axios.get(config.api_url + `/api/v1/submissions/all`)
    return response
}

const getAllFormsSorted = async (sortOption: String | undefined, direction: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/submissions/sort/${sortOption}/${direction}`)
    return response
}

const getSubmissionById = async (submissionId: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/submission/id/${submissionId}`)
    return response
}

const getTeamsAdvancedFromAPI = async () => {
    const response = axios.get(config.api_url + `/api/v1/teamsAdvanced`)
    return response
}

const getAllTeamsSorted = async (sortOption: String | undefined, direction: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/aggregation/sort/${sortOption}/${direction}`)
    return response
}

const getTeamAvatar = async (team: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/team/${team}/avatar`)
    return response
}

const getAllTeamAvatars = async () => {
    const response = await axios.get(config.api_url + `/api/v1/teamsAvatars`)
    return response
}

export default {
    /** Gets all team numbers from the API */
    getTeamsFromAPI,
    /** Grabs a team nickname fom the API by team number */
    getTeamNicknameFromAPI,
    getTeamSubmissions,
    getFormSubmissionData,
    getTeamEventData,
    getEventData,
    getAllFormData,
    getEventMatchData,
    getMatchData,
    getMatchSubmissionData,
    getAggregationData,
    getAllFormSorting,
    getAllFormsSorted,
    getSubmissionById,
    getTeamsAdvancedFromAPI,
    getAllTeamsSorted,
    getTeamAvatar,
    getAllTeamAvatars
}