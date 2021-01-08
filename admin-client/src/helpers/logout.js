import axios from 'axios';

function logout(getUser, history) {
  const serverUrl = window.apiServer;
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
