import axios from "axios";
import { config } from "../../Constants";

const getUsersFromAPI = async (token: any) => {
    const response = await axios.get(config.api_url + "/api/v1/admin/users", {
        headers: {
            'Authorization': `Basic ${token}`,
        }
    });
    return response
}

const getEventLockFromAPI = async (token: any) => {
    const response = await axios.get(config.api_url + "/api/v1/admin/eventLock", {
        headers: {
            'Authorization': `Basic ${token}`,
        }
    });
    return response
}


const checkTokenFromAPI = async (token: any) => {
    const response = await axios.get(config.api_url + "/api/v1/util/tokenCheck", {
        headers: {
            'Authorization': `Basic ${token}`,
        }
    });
    return response
}

const ConfigFunctions = {
    getUsersFromAPI,
    checkTokenFromAPI,
    getEventLockFromAPI
}

export default ConfigFunctions