import { logoutAction } from "../redux/services";

export default function logout(getUser, history) {
    logoutAction().then(() => {
        getUser();
        history.replace({ pathname: '/' });
    });
}
