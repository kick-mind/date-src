const fs = require('fs');
const path = require('path');
const { RuntimeLocale } = require('../../dist');

const locales = fs.readFileSync(path.resolve(__dirname, './locales.txt'), 'utf8').split(/\r?\n/);

locales.forEach(localeName => {
    const filePath = `./output/${localeName}.js`;

    try {
        const rl = new RuntimeLocale(localeName);
        staticLocaleData = {

        };

        fs.writeFile(filePath, 'ok', () => {});
    } catch (e) {
        console.log('Locale generation failed for locale: ' + localeName);
    }

    // console.log(rl.getWeekdayNames('short'));
});
