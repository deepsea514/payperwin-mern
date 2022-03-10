import axios from "axios";
import _env from '../env.json';
const serverUrl = _env.appUrl;

const FrontendAPI = axios.create({
    baseURL: serverUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export default FrontendAPI;