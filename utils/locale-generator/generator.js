const fs = require('fs');
const path = require('path');

const lines = fs.readFileSync(path.resolve(__dirname, './locales.txt'), 'utf8').split(/\r?\n/);
lines.forEach(l => {
    console.log(l);
});
