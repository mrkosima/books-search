const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
  entry: {
    app: "./src/app"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devtool: "inline-source-map",
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Playground Custom Elements",
      template: "./src/index.html"
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    port: 3000
  },
};
