const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  entry: {
    core: "./src/index.ts",
    gregorian: {
      import: "./src/calendar/gregorian/gregorian.ts",
      dependOn: "core",
    },
    gregorian2: {
      import: "./src/calendar/gregorian/gregorian2.ts",
      dependOn: "core",
    },
    persian: {
      import: "./src/calendar/persian/persian.ts",
      dependOn: "core",
    },
    hijri: {
      import: "./src/calendar/hijri/hijri.ts",
      dependOn: "core",
    },
  },
  plugins: [new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })],

  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    library: "Jss_[name]",
    libraryTarget: "umd",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  mode: "production",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
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
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
};
const node = {
  ...config,
  output: {
    ...config.output,
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist/build/node"),
  },
};
const browser = {
  ...config,
  output: {
    ...config.output,
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist/build/brwser"),
  },
};

const amd = {
  ...config,
  output: {
    ...config.output,
    libraryTarget: "amd",
    path: path.resolve(__dirname, "dist/build/amd"),
  },
};

module.exports = [amd, browser, node];
