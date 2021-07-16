const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'production',
    entry: {
        jss: "./src/index.ts",
        gregorian: {
            import: "./src/calendar/gregorian/gregorian.ts",
            
            dependOn: "jss",
        },
        gregorian2: {
            import: "./src/calendar/gregorian/gregorian2.ts",
            dependOn: "jss",
        },
        persian: {
            import: "./src/calendar/persian/persian.ts",
            dependOn: "jss",
        },
        hijri: {
            import: "./src/calendar/hijri/hijri.ts",
            dependOn: "jss",
        },
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        // publicPath: "/",
        library: {
            name: "jss",
            type: "umd",
        },
        libraryTarget: "umd",
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
    ],
    optimization: {
        minimize: true,
    }
}


// const path = require("path");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// const fs = require("fs");
// const { library } = require("webpack");

// const config = {
//   entry: {
//     jss: "./src/index.ts",
//     gregorian: {
//       import: "./src/calendar/gregorian/gregorian.ts",
//       dependOn: "jss",
//     },
//     gregorian2: {
//       import: "./src/calendar/gregorian/gregorian2.ts",
//       dependOn: "jss",
//     },
//     persian: {
//       import: "./src/calendar/persian/persian.ts",
//       dependOn: "jss",
//     },
//     hijri: {
//       import: "./src/calendar/hijri/hijri.ts",
//       dependOn: "jss",
//     },
//   },
//   plugins: [
//     new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
//   ],

//   output: {
//     filename: "[name].min.js",
//     path: path.resolve(__dirname, "dist"),
//     publicPath: "/",
//     library: {
//       name: "[name]",
//       type: "umd",
//     },
//     libraryTarget: "umd",
//     globalObject: "this",
//   },
//   optimization: {
//     minimize: true,
//     minimizer: [
//       new TerserPlugin({
//         terserOptions: {
//           keep_classnames: true,
//         },
//       }),
//     ],
//   },
//   mode: "production",
//   //devtool: "source-map",
//   resolve: {
//     extensions: [".ts"],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts?$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//     ],
//   },

//   // optimization: {
//   //   splitChunks: {
//   //     chunks: 'all',
//   //   },
//   // },
// };
// const locales = [];

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

// const node = {
//   ...config,
//   target: "node",
//   output: {
//     ...config.output,
//     library: {
//       name: "[name]",
//       type: "var",
//     },
//     libraryTarget: "umd",
//     path: path.resolve(__dirname, `dist/build/node/`),
//   },
// };
// const browser = {
//   ...config,
//   output: {
//     ...config.output,
//     library: {
//       name: "[name]",
//       type: "var",
//     },
//     libraryTarget: "umd",
//     path: path.resolve(__dirname, "dist/build/browser"),
//   },
// };

// const amd = {
//   ...config,
//   output: {
//     ...config.output,
//     library: {
//       name: "[name]",
//       type: "var",
//     },
//     libraryTarget: "amd",
//     path: path.resolve(__dirname, "dist/build/amd"),
//   },
// };

// module.exports = [amd, browser, node];
