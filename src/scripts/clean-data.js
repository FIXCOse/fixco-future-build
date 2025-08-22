const fs = require('fs');
const path = require('path');

// Read the servicesData.ts file
const dataPath = path.join(__dirname, '../data/servicesData.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Remove all lines with difficulty: and the comma from the previous line
content = content.replace(/,?\n\s*difficulty: "[^"]*",?/g, '');
content = content.replace(/difficulty: "[^"]*",?\n/g, '');

// Clean up any trailing commas that might be left
content = content.replace(/,\s*}/g, '}');

// Write back the cleaned content
fs.writeFileSync(dataPath, content, 'utf8');

console.log('Cleaned servicesData.ts - removed all difficulty references');