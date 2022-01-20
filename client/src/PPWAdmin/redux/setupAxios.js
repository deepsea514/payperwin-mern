export default function setupAxios(axios, key = "admin-token") {
    axios.interceptors.request.use(
        config => {
            const authToken = localStorage.getItem(key);
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        },
        err => Promise.reject(err)
    );
}
