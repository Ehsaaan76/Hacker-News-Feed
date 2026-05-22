function FlashList({ data = [], renderItem }) {
  return data.map((item, index) => renderItem({ item, index }));
}

module.exports = { FlashList };