import { io } from "socket.io-client";
import config from "../../../config.json";
const appUrl = config.serverHostToClientHost[window.location.host].appUrl;

const socket = io(appUrl);

socket.on("connect", () => {
});
socket.on("disconnect", () => {
});

export default socket;
