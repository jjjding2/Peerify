import socketIOClient from "socket.io-client";

const ENDPOINT = "http://138.197.129.190:5000";
//const ENDPOINT = "http://localhost:5000";

const socket = socketIOClient(ENDPOINT);

export default socket;