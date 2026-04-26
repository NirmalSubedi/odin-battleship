import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/ui/template.html",
    }),
  ],
  module: {
    rules: [
      // Html image loader - to remove run 'npm uninstall --save-dev html-loader'
      {
        test: /\.html/i,
        loader: "html-loader",
      },
      // Css loader
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // Js image loader
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // Font files loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
