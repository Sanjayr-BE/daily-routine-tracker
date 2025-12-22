export const getFromStorage = (key, defaultValue = []) => {
try {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : defaultValue;
} catch (err) {
console.error("Storage read error", err);
return defaultValue;
}
};


export const saveToStorage = (key, value) => {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch (err) {
console.error("Storage save error", err);
}
};