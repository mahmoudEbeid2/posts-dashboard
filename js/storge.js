// save
export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// get
export function getFromStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// remove
export function removeFromStorage(key) {
  localStorage.removeItem(key);
}
