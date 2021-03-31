import { io } from "socket.io-client";
import config from "../../../config.json";
const appUrl = config.appUrl;

const socket = io(appUrl);

socket.on("connect", () => {
});
socket.on("disconnect", () => {
});

export default socket;
