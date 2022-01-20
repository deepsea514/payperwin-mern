import axios from "axios";
import _env from '../../env.json';
const serverUrl = _env.appUrl + '/affiliate';

const AffiliateAPI = axios.create({
    baseURL: serverUrl,
    headers: { 'Content-Type': 'application/json' },
});
export default AffiliateAPI;