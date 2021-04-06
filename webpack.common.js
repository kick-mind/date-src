const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
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
    hijri: {
      import: "./src/locale/repo/fa-ir.ts",
      dependOn: "core",
    },
    core: "./src/index.ts",
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
                keep_classnames: true
            }
          })
        ]
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: "initial",
  //   },
  // },
};
