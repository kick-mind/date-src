const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
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
            library: {
                type: 'umd',
            }
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
            library: {
                type: 'umd',
            }
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
            library: {
                name: 'jss',
                type: 'umd',
            },
        },
        ...getCalendarsEntries(),
        ...getPluginsEntries()
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
