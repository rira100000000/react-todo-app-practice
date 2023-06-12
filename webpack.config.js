const path = require("path");

module.exports = {
  entry: "./src/todo.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "todo.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/, // .js拡張子のファイルに対して
        exclude: /node_modules/, // node_modulesディレクトリは除外
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // 解決する拡張子のリストを指定
  },
};
