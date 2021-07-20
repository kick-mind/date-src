const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const path = require("path");

// (function () {
//   const arr = [];
//   fs.readdirSync("./src/locale/repo").forEach((file) => {
//     config.entry[file.substr(0, file.length - 3)] = {
//       import: "./src/locale/repo/".concat(file),
//       dependOn: "jss",
//     };
//     locales.push(file.substr(0, file.length - 3));
//   });
//   return arr;
// })();


/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'production',
    entry: {
        main: {
            import: "./src/main/index.ts",
            filename: 'main/jss-date.js',
            library: {
                name: 'jss',
                type: 'umd',
            },
        },
        gregorian: {
            import: "./src/calendars/gregorian.ts",
            filename: 'calendars/gregorian.js',
            dependOn: "main",
            library: {
                type: 'umd',
            }
        },
        gregorian2: {
            import: "./src/calendars/gregorian2.ts",
            filename: 'calendars/gregorian2.js',
            dependOn: "main",
            library: {
                type: 'umd',
            }
        },
        persian: {
            import: "./src/calendars/persian.ts",
            filename: 'calendars/persian.js',
            dependOn: "main",
            library: {
                type: 'umd',
            }
        },        
        hijri: {
            import: "./src/calendars/hijri.ts",
            filename: 'calendars/hijri.js',
            dependOn: "main",
            library: {
                type: 'umd',
            }
        },
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: "/",
        globalObject: "this",
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/package.json" },
                { from: "README.md" }
            ],
        }),
    ],
    optimization: {
        minimize: true
    }
}
