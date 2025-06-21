// back-end/src/utils/uniqueIdGenerator.js
function generateUniqueId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4); // like "K8Z0"
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${randomLetter}${timestampPart}${randomPart}`; // e.g., "A1ZC3847"
}

module.exports = generateUniqueId;
