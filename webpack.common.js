const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        jalaali: './src/date/jalaali/jalaali-date-time.ts',
        gregorian: './src/date/gregorian/gregorian-date-time.ts'
    },
    plugins: [
       // new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        library: "@js-sugar/date",
        libraryTarget: "umd",
    },
};