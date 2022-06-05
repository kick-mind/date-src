const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");
const path = require("path");

function getCalendarsEntries() {
    const files = fs.readdirSync("./src/calendars");
    const calendars = files.filter(x => !x.toLocaleLowerCase().endsWith('spec.ts'));
    const entries = {};
    calendars.forEach((cal) => {
        const name = path.parse(cal).name;
        entries[name] = {
            import: `./src/calendars/${cal}`,
            filename: `./calendars/${name}.js`,
            dependOn: "main",
        };
    });

    return entries;
}

function getPluginsEntries() {
    const files = fs.readdirSync("./src/plugins");
    const plugins = files.filter(x => !x.toLocaleLowerCase().endsWith('spec.ts'));
    const entries = {};
    plugins.forEach((plugin) => {
        const name = path.parse(plugin).name;
        entries[name] = {
            import: `./src/plugins/${plugin}`,
            filename: `./plugins/${name}.js`,
            dependOn: "main",
        };
    });

    return entries;
}

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'production',
    entry: {
        main: {
            import: "./src/main/index.ts",
            filename: 'main/jss-date.js',
        },
        ...getCalendarsEntries(),
        ...getPluginsEntries()
    },
    output: {
        path: path.resolve(__dirname, "dist", "package"),
        filename: "[name].js",
        publicPath: "/",
        globalObject: "this",
        library: {
            name: 'jss-date',
            type: 'umd',
        },
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
                { from: "src/README.md" },
                { from: "src/CHANGELOG.md" },
            ],
        }),
    ],
    optimization: {
        // runtimeChunk: 'multiple',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    //   mangle: false,
                    keep_classnames: true,
                },
            }
            )
        ],
    },
}
