module.exports = {
  entry: {
    //"vendor": "./app/vendor",
    "app": "./app/main"
  },
  output: {
    path: __dirname + "/public/js",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  //devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts/,
        loaders: ["ts-loader"],
        exclude: /node_modules/
      }
    ]
  }
}