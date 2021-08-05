import { io } from "socket.io-client";
import config from "../../../config.json";
const appUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

const socket = io(appUrl);

socket.on("connect", () => {
});
socket.on("disconnect", () => {
});

export default socket;
