import axios from 'axios';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

function logout(getUser, history) {
    const url = `${serverUrl}/logout`;
    axios(
        {
            method: 'get',
            url,
            withCredentials: true,
        },
    ).then((/* d */) => {
        getUser();
        history.replace({ pathname: '/' });
    });
}

export default logout;
