import axios from "axios";
import config from "../../../../../../config.json";
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appAdminUrl;

export function getVerifications(page, perPage = null) {
    let url = `${serverUrl}/verifications?page=${page}`;
    if (perPage) url += `&perPage=${perPage}`;

    return axios.get(url, { withCredentials: true });
}

export function getVerificationImage(user_id, name) {
    let url = `${serverUrl}/verification-image`;
    return axios.post(url, {
        user_id,
        name
    }, { withCredentials: true });
}

export function acceptVerification(user_id) {
    let url = `${serverUrl}/verification-accept`;
    return axios.post(url, {
        user_id,
    }, { withCredentials: true });
}

export function declineVerification(user_id) {
    let url = `${serverUrl}/verification-decline`;
    return axios.post(url, {
        user_id,
    }, { withCredentials: true });
}