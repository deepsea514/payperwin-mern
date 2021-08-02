import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[window.location.host].appUrl;

export function setPreferences(preference) {
    return axios.post(`${serverUrl}/preferences`, preference, { withCredentials: true })
}