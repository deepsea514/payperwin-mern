import axios from 'axios';

const config = require('../../../config.json');
const serverUrl = config.appUrl;

export function setPreferences(preference) {
    return axios.post(`${serverUrl}/preferences`, preference, { withCredentials: true })
}