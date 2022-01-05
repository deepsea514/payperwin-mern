import axios from "axios";
import _env from '../../env.json';
const serverUrl = _env.appAdminUrl;

const AdminAPI = axios.create({
    baseURL: serverUrl,
    headers: { 'Content-Type': 'application/json' },
});
export default AdminAPI;