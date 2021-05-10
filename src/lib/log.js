const debug = require('../static/info.json').dev.debug;

const nullFunction = () => {}
const Log = debug === true ? console.log : nullFunction
const Info = debug === true ? console.info : nullFunction

module.exports = {
  Log,
  Info
};
