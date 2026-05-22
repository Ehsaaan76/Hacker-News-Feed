const React = require('react');

function jsx(type, props, key) {
  return React.createElement(type, { ...props, key });
}

module.exports = {
  jsx,
  jsxs: jsx,
  jsxDEV: jsx,
  Fragment: React.Fragment,
};