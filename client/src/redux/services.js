import axios from 'axios';
import _env from '../env.json';
const serverUrl = _env.appUrl;

export function setPreferences(preference) {
    return axios.post(`${serverUrl}/preferences`, preference, { withCredentials: true })
}