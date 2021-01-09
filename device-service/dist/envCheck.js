"use strict";

const envCheck = check => {
  // Ensure required ENV vars are set
  let requiredEnv = ['SOCKET_URL', 'DEVICES', 'FIRESTATION', 'DEVICE_USERNAME', 'DEVICE_PASSWORD', 'SOCKET_KEY', 'SCREEN_KEY'];
  let unsetEnv = requiredEnv.filter(env => !(typeof process.env[env] !== 'undefined'));

  if (unsetEnv.length > 0) {
    throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']');
  }
};

module.exports = envCheck;
//# sourceMappingURL=envCheck.js.map