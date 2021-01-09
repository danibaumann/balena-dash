"use strict";

var _socket = require("socket.io-client");

const axios = require('axios');

require('dotenv').config(); // check env values


require('./envCheck')();

const socket = (0, _socket.io)(process.env.SOCKET_URL, {
  path: '/fsas',
  auth: {
    key: process.env.SOCKET_KEY
  }
}); // join fs room on connection

socket.on('connect', () => {
  console.log('connected to socket server');
  console.log(process.env.FIRESTATION);
  socket.emit('joinFSRoom', {
    room: process.env.FIRESTATION,
    screenKey: process.env.SCREEN_KEY,
    clientId: 'io-device-service'
  });
}); // register on welcome messaage

socket.on('welcomeMsg', async m => {
  console.log(m); // send device id to the socket
}); // on received alarms

socket.on('newAlarm', async m => {
  await notifyDevices();
  console.log('Done with calling the on prem devices');
}); // on practice alarms

socket.on('practiceAlarm', async m => {
  await notifyDevices();
  console.log('Done with calling the on prem devices');
}); // function on missing connection

socket.on('fsNotFound', m => {
  console.log(m);
}); // function on missing connection

socket.on('disconnect', () => {
  console.log('disconnected');
}); // Function to toggle all on prem IoT devices on incoming alarm

const notifyDevices = async () => {
  const devices = JSON.parse(process.env.DEVICES) || [];

  if (devices.length < 1) {
    console.log('No on prem devices specified');
    return;
  }

  console.log(devices);
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: process.env.DEVICE_USERNAME,
      password: process.env.DEVICE_PASSWORD
    }
  }; // call the turn on API to send IO signal. The device is set up so it turn off automatically after 1 second
  // for a backup, we send turn off command if the device has lost the settings

  for await (const device of devices) {
    let res;

    try {
      res = await axios.get(`http://${device.ip}/relay/0?turn=on`, options);
      console.log(`Finished activating device: ${device.name}`); // console.log(res.data);

      const turnOffDelay = device.turnOffDelay || 2000;

      if (!res.data.has_timer) {
        // timeout for x seconds before sending turn off signal if device has no timer set up
        setTimeout(async () => {
          console.log(`send off signal to ${device.name}`);
          res = await axios.get(`http://${device.ip}/relay/0?turn=off`, options);
        }, turnOffDelay);
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }
};
//# sourceMappingURL=index.js.map