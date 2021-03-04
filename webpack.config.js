const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: {
        jalaali: './src/date/jalaali/jalaali-date-time.ts',
        gregorian: './src/date/gregorian/gregorian-date-time.ts'
    },
    devtool: 'inline-source-map',
    plugins: [
       // new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        library: "@js-sugar/date",
        libraryTarget: "umd",
    },
};