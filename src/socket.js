import socketIOClient from "socket.io-client";

const ENDPOINT = "https://peerify.live:5000";
// const ENDPOINT = "http://localhost:5000";

const socket = socketIOClient(ENDPOINT);

export default socket;