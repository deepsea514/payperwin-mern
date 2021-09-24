import { io } from "socket.io-client";
import _env from '../env.json';
const serverUrl = _env.appUrl;

const socket = io(serverUrl);

socket.on("connect", () => {
});
socket.on("disconnect", () => {
});

export default socket;
