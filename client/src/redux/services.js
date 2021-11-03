import axios from 'axios';
import _env from '../env.json';
const serverUrl = _env.appUrl;

export function setPreferences(preference) {
    return axios.post(`${serverUrl}/preferences`, preference, { withCredentials: true })
}

export function toggleFavorites(data) {
    return axios.post(`${serverUrl}/favorites/toggle`, data, { withCredentials: true })
}

export function getUser() {
    return axios.get(`${serverUrl}/user?compress=false`, { withCredentials: true });
}