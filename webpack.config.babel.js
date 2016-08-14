import path from "path";

let config = {
  entry: path.join(__dirname, "webpack.js"),
  output: {
    path: path.join(__dirname, "server/public"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"]
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      {
        test: /\.(jpg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loaders: ["file-loader"]
      }
    ]/*,
    postLoaders: [
      {
        test: /\.js$/, // Minify all .js files
        loaders: ['uglify-loader']
      }
    ]*/
  }
};

export default config;
