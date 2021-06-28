const hex = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

const generateId = () => {
  return `${hex()}-${hex()}-${hex()}-${hex()}`;
};

export default generateId;