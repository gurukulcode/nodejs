// 'use strict';

// const autocannon = require('autocannon');

// autocannon(
//   {
//     url: 'https://node-lujqrm--3000.local.webcontainer.io/bcrypt',
//     // connections: 10, //default
//     // pipelining: 1, // default
//     // duration: 10, // default
//     // workers: 4,
//   },
//   console.log
// );

'use strict';

const autocannon = require('autocannon');

const instance = autocannon(
  {
    url: 'https://node-lujqrm--3000.local.webcontainer.io/bcrypt',
  },
  console.log
);

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop();
});

// just render results
autocannon.track(instance, { renderProgressBar: false });
