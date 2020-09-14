"use strict";

var _socket = _interopRequireDefault(require("socket.io-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const axios = require('axios');

require('dotenv').config(); // check env values


require('./envCheck')();

const socket = (0, _socket.default)(process.env.SOCKET_URL); // join fs room on connection

socket.on('connect', () => {
  console.log('connected to socket server');
  socket.emit('joinFSRoom', process.env.FIRESTATION);
}); // register on welcome messaage

socket.on('welcomeMsg', async m => {
  console.log(m);
});
socket.on('newAlarm', async m => {
  console.log(m);
  await notifyDevices(JSON.parse(process.env.DEVICES));
  console.log('Done with IoT Devices');
}); // function on missing connection

socket.on('disconnect', () => {
  console.log('disconnected');
}); // Function to toggle all on prem IoT devices on incoming alarm

const notifyDevices = async devices => {
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: process.env.DEVICE_USERNAME,
      password: process.env.DEVICE_PASSWORD
    }
  };

  for await (const device of devices) {
    let res;

    try {
      res = await axios.get(`http://${device}/relay/0?turn=on`, options);
    } catch (err) {
      console.log(`error: ${err.message}`);
    }

    console.log(res.data);
  }
};
//# sourceMappingURL=index.js.map