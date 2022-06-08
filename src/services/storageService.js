export const getFromStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
