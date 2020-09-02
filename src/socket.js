import socketIOClient from "socket.io-client";

const ENDPOINT = "http://159.89.114.63:5000";
// const ENDPOINT = "http://localhost:5000";

const socket = socketIOClient(ENDPOINT);

export default socket;