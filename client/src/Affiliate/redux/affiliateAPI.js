import axios from "axios";
import _env from '../../env.json';

const AffiliateAPI = axios.create({
    baseURL: _env.appUrl + '/affiliate',
    headers: { 'Content-Type': 'application/json' },
});
export default AffiliateAPI;