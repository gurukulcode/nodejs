'use strict';

const WorkerPool = require('workerpool');
const Utilities = require('../utility.js');

// MIDDLEWARE FUNCTIONS
const bcryptHash = (password) => {
  return Utilities.bcryptHash(password);
};

// CREATE WORKERS
WorkerPool.worker({
  bcryptHash,
});
