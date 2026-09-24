const defaultT = require('./default');
const terminalT = require('./terminal');
const gradientT = require('./gradient');
const minimalT = require('./minimal');
const newspaperT = require('./newspaper');

const REGISTRY = {
  default: defaultT,
  terminal: terminalT,
  gradient: gradientT,
  minimal: minimalT,
  newspaper: newspaperT,
};

function get(name) {
  return REGISTRY[name] || REGISTRY.default;
}

function list() {
  return Object.keys(REGISTRY);
}

module.exports = { get, list, REGISTRY };
