function createMMKV() {
  const storage = new Map();

  return {
    set: (key, value) => {
      storage.set(key, value);
    },
    getString: (key) => storage.get(key),
    remove: (key) => {
      storage.delete(key);
    },
  };
}

module.exports = { createMMKV };