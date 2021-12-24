import _env from '../env.json';
import axios from 'axios';
const serverUrl = _env.appUrl;

export function logout(getUser, history) {
    const url = `${serverUrl}/logout`;
    axios.get(url, { withCredentials: true })
        .then(() => {
            getUser();
            history.replace({ pathname: '/' });
        });
}
