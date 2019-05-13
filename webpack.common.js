const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    booksSearch: "./src"
  },
  output: {
    filename: "[name].[chunkhash].bundle.js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [
      // { test: /\.ts$/, exclude: /node_modules/, loader: "eslint-loader" },
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".css"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Books Search",
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      inject: "head"
    })
  ]
};
