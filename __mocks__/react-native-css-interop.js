const React = require('react');

function identity(value) {
  return value;
}

function createElement(type, props, key) {
  return {
    $$typeof: Symbol.for('react.element'),
    type,
    key: key == null ? null : String(key),
    ref: null,
    props: props ?? {},
    _owner: null,
  };
}

module.exports = {
  cssInterop: identity,
  cva: identity,
  useColorScheme: () => ({
    colorScheme: 'light',
    setColorScheme: () => {},
  }),
  createInteropElement: createElement,
  vars: identity,
  remapProps: identity,
  jsx: createElement,
  jsxs: createElement,
  Fragment: React.Fragment,
};