'use strict';

const autocannon = require('autocannon');

const instance = autocannon(
  {
    // url: 'https://node-lujqrm--3000.local.webcontainer.io/bcrypt',
    url: 'http://localhost:6000/bcrypt',
  },
  // console.log
);

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop();
});

// just render results
autocannon.track(instance, { renderProgressBar: false });
