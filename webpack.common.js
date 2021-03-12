const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        jalaali: './src/dates/persian/persian.ts',
        gregorian: './src/dates/gregorian/gregorian.ts'
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