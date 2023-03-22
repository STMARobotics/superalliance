import axios from "axios";
import { config } from "../../Constants";

const getTeamsFromAPI = async () => {
    const response = await axios.get(config.api_url + "/api/v1/teams");
    return response
}

const getTeamsInEventFromAPI = async (event: String) => {
    const response = await axios.get(config.api_url + `/api/v1/teamsInEvent/${event}`);
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

const getAllFormData = async (event: String) => {
    const response = await axios.get(config.api_url + `/api/v1/submissions/event/${event}`)
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

const getTeamsInEventAdvancedFromAPI = async (event: String) => {
    const response = axios.get(config.api_url + `/api/v1/teamsAdvancedInEvent/${event}`)
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

const getTeamEventDataLanding = async (teamNumber: Number, year: Number) => {
    const response = await axios.get(config.api_url + `/api/v1/events/${teamNumber}/${year}/landing`);
    return response
}

const getAggregationDataEvent = async (eventCode: String) => {
    const response = await axios.get(config.api_url + `/api/v1/aggregation/event/${eventCode}/data`)
    return response
}

const getAllTeamsSortedEvent = async (event: String | undefined, sortOption: String | undefined, direction: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/aggregation/${event}/sort/${sortOption}/${direction}`)
    return response
}

const getMatchYoutubeData = async (event: String | undefined, matchNumber: Number | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/matchYoutube/${event}/${matchNumber}`)
    return response
}

const getCriticalYoutubeData = async (event: String | undefined, teamNumber: Number | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/criticalsYoutube/${event}/${teamNumber}`)
    return response
}

const getAllCriticalYoutubeData = async (event: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/allCriticalsYoutube/${event}`)
    return response
}

const getTeamsInMatchData = async (event: String | undefined, matchNumber: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/matchData/${event}/${matchNumber}`)
    return response
}

const getPitScoutingData = async (team: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/pitdata/${team}`)
    return response
}

const getTeamEventStatus = async (event: String | undefined, team: String | undefined) => {
    const response = await axios.get(config.api_url + `/api/v1/teamEventStatus/${event}/${team}`)
    return response
}

const TeamFunctions = {
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
    getAllTeamAvatars,
    getTeamEventDataLanding,
    getTeamsInEventFromAPI,
    getTeamsInEventAdvancedFromAPI,
    getAggregationDataEvent,
    getAllTeamsSortedEvent,
    getMatchYoutubeData,
    getCriticalYoutubeData,
    getAllCriticalYoutubeData,
    getTeamsInMatchData,
    getPitScoutingData,
    getTeamEventStatus
}

export default TeamFunctions