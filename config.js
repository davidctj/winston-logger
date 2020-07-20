const conf = require('config');

var config = {}

config.winston = JSON.parse(JSON.stringify(conf.get('winston')));

module.exports = config;