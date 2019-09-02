const path = require('path');

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ClosurePlugin = require('closure-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const pjson = require("./package.json")

const BANNER_TITLE = process.env.BANNER_TITLE ||
  `----------------------------------------
Name:     ${pjson.name}
Version:  ${pjson.version}
Author:   ${pjson.author}
----------------------------------------`

const DIST_FOLDER = process.env.DIST_FOLDER || "dist"
const REPORT_FOLDER = process.env.REPORT_FOLDER || "reports"

const DEV_STATISTIC_HTML = process.env.DEV_STATISTIC_HTML || "statistic-dev.html"
const STATISTIC_HTML = process.env.STATISTIC_HTML || "statistics.html"

const NODE_ENV = process.env.NODE_ENV || "development"
if (!["development", "testing", "production"].includes(NODE_ENV)) NODE_ENV = "development"

const isDev = NODE_ENV === "development"

const apps = [{
  name: "deployment",
  file: "./index.ts"
}]

const entry = {}
apps.forEach(app => entry[app.name] = app.file)

const minimizer = [new ClosurePlugin({
  mode: 'STANDARD',
  childCompilations: true
}, {
  formatting: 'PRETTY_PRINT',
  debug: isDev,
  renaming: !isDev
})]
if (!isDev) minimizer.push(new UglifyJsPlugin({
  extractComments: {
    condition: true,
    banner() {
      return BANNER_TITLE;
    },
  }
}))

module.exports = {
  mode: NODE_ENV,
  entry,
  devtool: "inline-source-map",
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: "pre",
        use: [{
          loader: "tslint-loader",
          options: {
            typeCheck: false,
            fix: true
          }
        }]
      },
      {
        test: /\.ts?$/,
        use: [{
          loader: "ts-loader",
          options: {
            allowTsInNodeModules: true
          }
        }]
      }
    ]
  },
  optimization: {
    nodeEnv: NODE_ENV,
    mangleWasmImports: true,
    moduleIds: isDev ? 'named' : 'hashed',
    minimize: !isDev,
    minimizer,
    splitChunks: {
      minSize: 0
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "__NODE_ENV__": JSON.stringify(NODE_ENV),
      "__COMPILE_DATE__": JSON.stringify(+new Date()),
      "__VERSION__": JSON.stringify(pjson.version)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Visualizer({
      filename: `../${REPORT_FOLDER}/${isDev ? DEV_STATISTIC_HTML : STATISTIC_HTML}`
    })
  ],
  resolve: {
    extensions: ["json", ".ts", ".js"]
  },
  output: {
    filename: isDev ? '[name].js' : '[name].min.js',
    path: path.resolve(__dirname, DIST_FOLDER)
  },
  target: "node",
  externals: [nodeExternals()],
  // externals: [nodeExternals({
  //   whitelist: ["include"]
  // })]
};
