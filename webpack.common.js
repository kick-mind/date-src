const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    core: {
      import: "./src/index.ts", 
    },
    persian: {
      import: "./src/calendar/persian/persian.ts",
    },
    hijri: {
      import: "./src/calendar/hijri/hijri.ts",
    },
    gregorian: {
      import: "./src/calendar/gregorian/gregorian.ts",
      dependOn:'calendar'
    },
    gregorian2: {
      import: "./src/calendar/gregorian/gregorian2.ts",
      dependOn:'calendar'
    },
    calendar:'./src/calendar/calendar.ts'
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })],
    optimization: {
     usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: false,
            keep_fnames: false,
            keep_classnames: false,
            mangle: {
              keep_fnames: false,
              keep_classnames: false,
              properties: {
                // reserved: ['Foo', 'BaseModel']
              },
            },
          },
          extractComments: false,
        }),
      ],
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
    library: "@js-sugar/date",
    libraryTarget: "umd", // umd - amd - commonJS
  }
};
